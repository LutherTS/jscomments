import fs from "fs";
import path from "path";

import { Linter } from "eslint";
import tseslint from "typescript-eslint";
import { resolveImportingPath } from "resolve-importing-path";

/* getSourceCodeFromFilePath */

// ESLint configs language options
export const typeScriptAndJSXCompatible = {
  // for compatibility with .ts and .tsx
  parser: tseslint.parser,
  // for compatibility with JSX
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

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
  const resolvedPath = resolveImportingPath(currentDir, importPath, cwd);
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

js-comments is taken on npm. 
JSComments, jscomments is free.
comment-variables in the end.
*/
