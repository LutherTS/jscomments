import fs from "fs";
import path from "path";

import { resolveImportingPath } from "resolve-importing-path";
import { getSourceCodeFromFilePath } from "get-sourcecode-from-file-path";

import { successFalse, successTrue, typeWarning } from "../constants/bases.js";

/**
 * @typedef {{
 *   success: false;
 *   errors: Array<{ message: string; type: "warning";}>;
 * } | {
 *   success: true;
 *   visitedSet: Set<string>;
 * }} FindAllImportsResults
 */

// IMPORTANT. findAllImports needs to be able to take a callback function that it can play at every recursion to find the corresponding value for go-to-definitions. But that's on the roadmap, not in the first release. The first implementation of this pinpoint go-to-definition mechanism will be made by analyzing each path obtained rather than by doing so as the paths are being obtained.

/**
 * Processes recursively and resolves a single import path. (Unlike `findAllImports`, here `currentDir`, `cwd`, `visitedSet`, `depth`, and `maxDepth` aren't options because they are mandatory and not pre-parameterized.)
 * @param {string} importPath The import path currently being addressed.
 * @param {Object} settings The required settings as follows:
 * @param {string} settings.currentDir The directory containing the import path currently being addressed.
 * @param {string} settings.cwd The current working directory.
 * @param {Set<string>} settings.visitedSet The set of strings tracking the import paths that have already been visited.
 * @param {number} settings.depth The current depth of the recursion.
 * @param {number} settings.maxDepth The maximum depth allowed for the recursion.
 * @returns `true` to continue to the next operation, `false` to stop the whole `findAllImports` process. //
 */
const processImport = (
  importPath,
  { currentDir, cwd, visitedSet, depth, maxDepth }
) => {
  // Resolves the provided import path.
  const resolvedPath = resolveImportingPath(currentDir, importPath, cwd);
  // Returns true early to skip processing on unresolved paths.
  if (!resolvedPath) return { ...successTrue, visitedSet };

  // Establishes the options for the next round of findAllImports.
  const findAllImportsOptions = {
    cwd,
    visitedSet,
    depth: depth + 1,
    maxDepth,
  };

  // Runs findAllImports on the imported path resolved, thus recursively.
  const findAllImportsResults = /** @type {FindAllImportsResults} */ (
    findAllImports(resolvedPath, findAllImportsOptions)
  );
  // Returns true if the round of findAllImports succeeded, false if it failed.
  return findAllImportsResults;
};

/**
 * Finds all import paths recursively related to a given file path.
 * @param {string} filePath The absolute path of the file whose imports are being recursively found, such as that of a project's `comments.config.js` file.
 * @param {Object} options The additional options as follows:
 * @param {string} [options.cwd] The current working directory, set as `process.cwd()` by default.
 * @param {Set<string>} [options.visitedSet] The current working directory, set as `process.cwd()` by default.
 * @param {number} [options.depth] The current depth of the recursion, instantiated at `0` by default.
 * @param {number} [options.maxDepth] The maximum depth allowed for the recursion, instantiated at `100` by default.
 * @returns The complete set of strings of import paths recursively related to the given file path in a success object (`success: true`). Errors are bubbled up during failures in a failure object (`success: false`).
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
    return {
      ...successFalse,
      errors: [
        {
          ...typeWarning,
          message: `WARNING. Max depth ${maxDepth} reached at ${filePath}.`,
        },
      ],
    };
  }
  // Fails early if no file is found.
  if (!fs.existsSync(filePath)) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeWarning,
          message: `WARNING. File not found at ${filePath}.`,
        },
      ],
    };
  }
  // Returns the existing set directly if a path has already been visited.
  if (visitedSet.has(filePath)) {
    return { ...successTrue, visitedSet };
  }

  // Updates the visited set.
  visitedSet.add(filePath);

  // Parses the file's source code AST.
  const sourceCode = getSourceCodeFromFilePath(filePath);
  // Fails early there is no AST.
  if (!sourceCode?.ast) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeWarning,
          message: `WARNING. Failed to parse AST for ${filePath}.`,
        },
      ],
    };
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
      const processImportResults = processImport(
        node.source.value,
        processImportSettings
      );
      if (!processImportResults) {
        return processImportResults;
      }
    }

    // CommonJS (require('x'))
    if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression" &&
      node.expression.callee.name === "require" &&
      node.expression.arguments[0]?.type === "Literal"
    ) {
      const processImportResults = processImport(
        node.expression.arguments[0].value,
        processImportSettings
      );
      if (!processImportResults) {
        return processImportResults;
      }
    }
  }

  return { ...successTrue, visitedSet };
};
