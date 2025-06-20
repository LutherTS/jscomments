import fs from "fs";
import path from "path";

import { resolveImportingPath } from "resolve-importing-path";
import { getSourceCodeFromFilePath } from "get-sourcecode-from-file-path";

/* findAllImports */

/**
 * Helper to process and recursively resolve a single import path.
 * @returns `true` to skip unresolved paths, `false` if resolution fails at any level.
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
  if (!resolvedPath) return true; // Skips unresolved paths (not an error).

  const result = findAllImports(
    resolvedPath,
    cwd,
    visited,
    depth + 1,
    maxDepth
  );
  return result !== null; // Returns false if child failed.
};

export const findAllImports = (
  filePath,
  cwd = process.cwd(),
  visited = new Set(),
  depth = 0,
  maxDepth = 100
) => {
  // Early failure checks (with logging).
  if (depth > maxDepth) {
    console.error(`ERROR. Max depth ${maxDepth} reached at ${filePath}.`);
    return null;
  }
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR. File not found at ${filePath}.`);
    return null;
  }
  if (visited.has(filePath)) return visited;

  // Parses AST.
  visited.add(filePath);
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

  return visited; // success
};
