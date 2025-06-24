import fs from "fs";
import path from "path";

import { resolveImportingPath } from "resolve-importing-path";
import { getSourceCodeFromFilePath } from "get-sourcecode-from-file-path";

/* findAllImports */
// IMPORTANT. findAllImports needs to be able to take a callback function that it can play at every recursion to find the corresponding value for go-to-definitions. But that's on the roadmap, not in the first release. The first implementation of this pinpoint go-to-definition mechanism will be made but analyzing each path obtained rather than by doing so as the paths are being obtained.
// At that time, findAllImports will still take importPath as its first argument, but everything else that is currently optional will need to be inside an object...? Or what if I were to just do this now? And to do the same with all of my recursive, pre-parameterized arguments?

/**
 * Processes recursively and resolves a single import path. (Unlike `findAllImports`, here `currentDir`, `cwd`, `visitedSet`, `depth`, and `maxDepth` aren't options because they are mandatory and not pre-parameterized.)
 * @param {string} importPath The import path currently being addressed.
 * @param {Object} settings The required settings as follows:
 * @param {string} settings.currentDir The directory containing the import path currently being addressed.
 * @param {string} settings.cwd The current working directory.
 * @param {string} settings.visitedSet The set of strings tracking the import paths that have already been visited.
 * @param {string} settings.depth The current depth of the recursion.
 * @param {string} settings.maxDepth The maximum depth allowed for the recursion.
 * @returns `true` to continue to the next operation, `false` to stop the whole `findAllImports` process.
 */
const processImport = (
  importPath,
  { currentDir, cwd, visitedSet, depth, maxDepth }
) => {
  // Resolves the provided import path.
  const resolvedPath = resolveImportingPath(currentDir, importPath, cwd);
  // Returns true early to skip processing on unresolved paths.
  if (!resolvedPath) return true;

  // Establishes the options for the next round of findAllImports.
  const findAllImportsOptions = {
    cwd,
    visitedSet,
    depth: depth + 1,
    maxDepth,
  };

  // Runs findAllImports on the imported path resolved, thus recursively.
  const findAllImportsResults = findAllImports(
    resolvedPath,
    findAllImportsOptions
  );
  // Returns true if the round of findAllImports succeeded, false if it failed.
  return findAllImportsResults !== null;
};

/**
 * Finds all import paths recursively related to a given file path.
 * @param {string} filePath The absolute path of the file whose imports are being recursively found, such as that of a project's `comments.config.js` file.
 * @param {Object} options The additional options as follows:
 * @param {string} [options.cwd] The current working directory, set as `process.cwd()` by default.
 * @param {Set<string>} [options.visitedSet] The current working directory, set as `process.cwd()` by default.
 * @param {number} [options.depth] The current depth of the recursion, instantiated at `0` by default.
 * @param {number} [options.maxDepth] The maximum depth allowed for the recursion, instantiated at `100` by default.
 * @returns The complete set of strings of import paths recursively related to the given file path, or `null` if an issue has arisen.
 */

export const findAllImports = (
  filePath,
  {
    cwd = process.cwd(),
    visitedSet = new Set(),
    depth = 0,
    maxDepth = 100,
  } = {}
) => {
  // Fails early if max depth is recursively reached.
  if (depth > maxDepth) {
    console.warn(`WARNING. Max depth ${maxDepth} reached at ${filePath}.`);
    return null;
  }
  // Fails early if no file is found.
  if (!fs.existsSync(filePath)) {
    console.warn(`WARNING. File not found at ${filePath}.`);
    return null;
  }

  // Updates the visited set.
  if (visitedSet.has(filePath)) return visitedSet;
  visitedSet.add(filePath);

  // Parses the file's source code AST.
  const sourceCode = getSourceCodeFromFilePath(filePath);
  if (!sourceCode?.ast) {
    console.warn(`WARNING. Failed to parse AST for ${filePath}.`);
    return null;
  }

  // Makes the joint settings for the conditional calls of processImport.
  const processImportSettings = {
    currentDir: path.dirname(filePath),
    cwd,
    visitedSet,
    depth,
    maxDepth,
  };

  // Processes all imports.
  for (const node of sourceCode.ast.body) {
    // ES Modules (import x from 'y')
    if (node.type === "ImportDeclaration") {
      if (!processImport(node.source.value, processImportSettings)) {
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
          processImportSettings
        )
      ) {
        return null;
      }
    }
  }

  return visitedSet; // success
};
