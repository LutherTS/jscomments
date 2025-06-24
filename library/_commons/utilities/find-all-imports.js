import fs from "fs";
import path from "path";

import { resolveImportingPath } from "resolve-importing-path";
import { getSourceCodeFromFilePath } from "get-sourcecode-from-file-path";

/* findAllImports */
// IMPORTANT. findAllImports needs to be able to take a callback function that it can play at every recursion to find the corresponding value for go-to-definitions. But that's on the roadmap, not in the first release. The first implementation of this pinpoint go-to-definition mechanism will be made but analyzing each path obtained rather than by doing so as the paths are being obtained.
// At that time, findAllImports will still take importPath as its first argument, but everything else that is currently optional will need to be inside an object...? Or what if I were to just do this now? And to do the same with all of my recursive, pre-parameterized arguments?

/**
 * Processes recursively and resolves a single import path. // (Unlike findAllImports, here `currentDir`, `cwd`, `visitedSet`, `depth`, and `maxDepth` aren't options because they are mandatory and not pre-parameterized.)
 * @param {string} importPath The import path currently being addressed.
 * @param {string} currentDir The directory containing the import path currently being addressed.
 * @param {string} cwd The current working directory, set as `process.cwd()` by default.
 * @param {Set<string>} visitedSet The set of strings tracking the import paths that have already been visited, instantiated as a `new Set()` by default.
 * @param {number} depth The current depth of the recursion, instantiated at `0` by default.
 * @param {number} maxDepth The maximum depth allowed for the recursion, instantiated at `100` by default.
 * @returns `true` to skip unresolved paths, `false` if resolution fails at any level.
 */
const processImport = (
  importPath,
  currentDir,
  cwd,
  visitedSet,
  depth,
  maxDepth
) => {
  const resolvedPath = resolveImportingPath(currentDir, importPath, cwd);
  if (!resolvedPath) return true;

  const result = findAllImports(
    resolvedPath,
    cwd,
    visitedSet,
    depth + 1,
    maxDepth
  );
  return result !== null; // Returns false if child failed.
};

/**
 * Finds all import paths recursively related to a given file path.
 * @param {string} filePath The absolute path of the file whose imports are being recursively found, such as that of a project's `comments.config.js` file.
 * @param {string} cwd The current working directory, set as `process.cwd()` by default.
 * @param {Set<string>} visitedSet The set of strings tracking the import paths that have already been visited, instantiated as a `new Set()` by default.
 * @param {number} depth The current depth of the recursion, instantiated at `0` by default.
 * @param {number} maxDepth The maximum depth allowed for the recursion, instantiated at `100` by default.
 * @param {{cwd: string; visitedSet: Set<string>; depth: number; maxDepth: number}} options
 * @returns The complete set of strings of import paths recursively related to the given file path, or `null` if an issue has arisen.
 */
export const findAllImports = (
  filePath,
  options = {
    cwd: process.cwd(),
    visitedSet: new Set(),
    depth: 0,
    maxDepth: 100,
  }
) => {
  // Obtained the pre-paramaterized arguments from the options.
  const { cwd, visitedSet, depth, maxDepth } = options;

  // Fails early if max depth is recursively reached.
  if (depth > maxDepth) {
    console.error(`ERROR. Max depth ${maxDepth} reached at ${filePath}.`);
    return null;
  }
  // Fails early if no file is found.
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR. File not found at ${filePath}.`);
    return null;
  }

  // Updates the visited set.
  if (visitedSet.has(filePath)) return visitedSet;
  visitedSet.add(filePath);

  // Parses the file's source code AST.
  const sourceCode = getSourceCodeFromFilePath(filePath);
  if (!sourceCode?.ast) {
    console.error(`ERROR. Failed to parse AST for ${filePath}.`);
    return null;
  }

  // Processes all imports.
  const currentDir = path.dirname(filePath);
  for (const node of sourceCode.ast.body) {
    // ES Modules (import x from 'y')
    if (node.type === "ImportDeclaration") {
      if (
        !processImport(
          node.source.value,
          currentDir,
          cwd,
          visitedSet,
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
          visitedSet,
          depth,
          maxDepth
        )
      ) {
        return null;
      }
    }
  }

  return visitedSet; // success
};
