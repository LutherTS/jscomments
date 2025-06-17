import fs from "fs";
import path from "path";

import { Linter } from "eslint";
import tseslint from "typescript-eslint";
import { loadConfig, createMatchPath } from "tsconfig-paths";

/**
 * @typedef {readonly [typeof TSX, typeof TS, typeof JSX, typeof JS, typeof MJS, typeof CJS]} Extensions
 * @typedef {import('eslint').Linter.LanguageOptions} LanguageOptions
 */

// JavaScript/TypeScript extensions
export const TSX = ".tsx";
export const TS = ".ts";
export const JSX = ".jsx";
export const JS = ".js";
export const MJS = ".mjs";
export const CJS = ".cjs";

// JavaScript/TypeScript extensions array
/** @type {Extensions} */
const EXTENSIONS = Object.freeze([TSX, TS, JSX, JS, MJS, CJS]); // In priority order

/* resolveImportPath */

/**
 * Finds the existing path of an import that does not have an extension specified.
 * @param {string} basePath The absolute import path with extension yet resolved.
 * @returns The absolute path with its extension or `null` if no path is found.
 */
const findExistingPath = (basePath) => {
  for (const ext of EXTENSIONS) {
    const fullPath = `${basePath}${ext}`;
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return null;
};

/**
 * Resolves an import path to a filesystem path, handling:
 * - Base url and aliases (via tsconfig.json `baseUrl` and `paths` compiler options)
 * - Missing extensions (appends `.ts`, `.tsx`, etc.)
 * - Directory imports (e.g., `./components` → `./components/index.ts`)
 * @param {string} currentDir The directory of the file containing the import (such as from `path.dirname(context.filename)`).
 * @param {string} importPath The import specifier (e.g., `@/components/Button` or `./utils`), from the current node.
 * @param {string} cwd The project root (such as from `context.cwd`).
 * @returns The absolute resolved path or `null` if no path is found.
 */
export const resolveImportPath = (
  currentDir,
  importPath,
  cwd = process.cwd()
) => {
  // Step 1: Resolves baseUrl and aliases
  const config = loadConfig(cwd);

  // creates a function that can resolve paths according to tsconfig's paths property if the config result type is success
  const resolveTSConfig =
    config.resultType === "success"
      ? createMatchPath(config.absoluteBaseUrl, config.paths)
      : null;

  // resolves a path that relies on tsconfig's baseUrl or aliases if any of the aforementioned are present in the import path
  const baseUrlOrAliasedPath = resolveTSConfig
    ? resolveTSConfig(importPath, undefined, undefined, EXTENSIONS)
    : null;

  // Step 2: Resolves relative/absolute paths
  const basePath = baseUrlOrAliasedPath || path.resolve(currentDir, importPath);

  // does not resolve on node_modules
  if (basePath.includes("node_modules")) return null;

  // Case 1: File with extension exists
  if (path.extname(importPath) && fs.existsSync(basePath)) return basePath;

  // Case 2: Tries appending extensions
  const extensionlessImportPath = findExistingPath(basePath);
  if (extensionlessImportPath) return extensionlessImportPath;

  // Case 3: Directory import (e.g., `./components` → `./components/index.ts`)
  const indexPath = path.join(basePath, "index");
  const directoryImportPath = findExistingPath(indexPath);
  if (directoryImportPath) return directoryImportPath;

  return null; // not found
};

// ESLint configs language options
const typeScriptAndJSXCompatible = {
  // for compatibility with .ts and .tsx
  parser: tseslint.parser,
  // for compatibility with JSX
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

/* getSourceCodeFromFilePath */

/**
 * Gets the ESLint-generated SourceCode object of a file from its resolved path.
 * @param {string} resolvedPath The resolved path of the file.
 * @param {LanguageOptions} languageOptions The languageOptions object used by `linter.verify()` defaulting to a version that is TypeScript- and JSX-compatible.
 * @returns The ESLint-generated SourceCode object of the file.
 */
export const getSourceCodeFromFilePath = (
  resolvedPath,
  languageOptions = typeScriptAndJSXCompatible
) => {
  // ensures each instance of the function is based on its own linter
  // (just in case somehow some linters were running concurrently)
  const linter = new Linter();
  // the raw code of the file at the end of the resolved path
  const text = fs.readFileSync(resolvedPath, "utf8");
  // utilizes linter.verify ...
  linter.verify(text, { languageOptions });
  // ... to retrieve the raw code as a SourceCode object
  const code = linter.getSourceCode();

  return code;
};

/* findAllImports */

/**
 * Helper to process and recursively resolve a single import path.
 * Returns false if resolution fails at any level.
 */
const processImport = (
  importPath,
  currentDir,
  cwd,
  visited,
  depth,
  maxDepth
) => {
  const resolvedPath = resolveImportPath(currentDir, importPath, cwd);
  if (!resolvedPath) return true; // Skip unresolved paths (not an error)

  const result = findAllImports(
    resolvedPath,
    cwd,
    visited,
    depth + 1,
    maxDepth
  );
  return result !== null; // Returns false if child failed
};

export const findAllImports = (
  filePath,
  cwd = process.cwd(),
  visited = new Set(),
  depth = 0,
  maxDepth = 100
) => {
  // Early failure checks (with logging)
  if (depth > maxDepth) {
    console.error(`ERROR. Max depth ${maxDepth} reached at ${filePath}.`);
    return null;
  }
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR. File not found at ${filePath}.`);
    return null;
  }
  if (visited.has(filePath)) return visited;

  // Parse AST
  visited.add(filePath);
  const sourceCode = getSourceCodeFromFilePath(filePath);
  if (!sourceCode?.ast) {
    console.error(`ERROR. Failed to parse AST for ${filePath}.`);
    return null;
  }

  // Process all imports
  const currentDir = path.dirname(filePath);
  for (const node of sourceCode.ast.body) {
    // ES Modules (import x from 'y')
    if (node.type === "ImportDeclaration") {
      if (
        !processImport(
          node.source.value,
          currentDir,
          cwd,
          visited,
          depth,
          maxDepth
        )
      ) {
        return null;
      }
    }

    // CommonJS (require('x'))
    if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression" &&
      node.expression.callee.name === "require" &&
      node.expression.arguments[0]?.type === "Literal"
    ) {
      if (
        !processImport(
          node.expression.arguments[0].value,
          currentDir,
          cwd,
          visited,
          depth,
          maxDepth
        )
      ) {
        return null;
      }
    }
  }

  return visited; // Success
};

/* Notes
So here I want to make
- resolveImportPath
- getSourceCodeFromFilePath (remember the reason I favored the sourceCode is because it grants access to the AST and to the comments.)
*/
