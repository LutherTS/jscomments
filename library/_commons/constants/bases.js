import fs from "fs";
import path from "path";

import tseslint from "typescript-eslint";

// plugin name
export const commentVariablesPluginName = "comment-variables";

// rule names
export const resolveRuleName = "resolve";
export const compressRuleName = "compress";

// current working directory
export const cwd = process.cwd();

// to prevent accidental changes
export const hasPackageJson = fs.existsSync(path.join(cwd, "package.json"));
// to prevent irreversible changes
export const hasGitFolder = fs.existsSync(path.join(cwd, ".git"));

// comments.config.js // comment-variables-resolve-config
export const defaultConfigFileName = "comments.config.js";

// flags // comment-variables-resolve-config
export const configFlag = "--config";
export const lintConfigImportsFlag = "--lint-config-imports";
export const myIgnoresOnlyFlag = "--my-ignores-only";

// ESLint ignores
export const knownIgnores = [
  "node_modules",
  "dist",
  "out",
  ".next",
  ".react-router",
  ".parcel-cache",
  ".react-router-parcel",
];

// ESLint file globs
export const allJSTSFileGlobs = [
  "**/*.js",
  "**/*.jsx",
  "**/*.ts",
  "**/*.tsx",
  "**/*.mjs",
  "**/*.cjs",
];
export const allMDFileGlobs = ["**/*.md"];
export const allMDVirtualJSTSFileGlobs = [
  "**/*.md/*.js",
  "**/*.md/*.jsx",
  "**/*.md/*.ts",
  "**/*.md/*.tsx",
  "**/*.md/*.cjs",
  "**/*.md/*.mjs",
];

// default ESLint config language options
export const typeScriptAndJSXCompatible = {
  // for compatibility with TypeScript (.ts and .tsx)
  parser: tseslint.parser,
  // for compatibility with JSX (React, etc.)
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

// messageId
export const placeholderMessageId = "placeholderMessageId";

// placeholder prefix // comment-variables-resolve-config
export const $COMMENT = "$COMMENT";

// success objects // comment-variables-resolve-config
export const successFalse = Object.freeze({
  success: false,
});
export const successTrue = Object.freeze({
  success: true,
});

// error objects // comment-variables-resolve-config
export const typeError = Object.freeze({
  type: "error",
});
export const typeWarning = Object.freeze({
  type: "warning",
});
