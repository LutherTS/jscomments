import fs from "fs";
import path from "path";

import tseslint from "typescript-eslint";

// plugin name
export const commentVariablesPluginName = "comment-variables"; // now to be in the resolveConfig package

// rule names
export const resolveRuleName = "resolve";
export const compressRuleName = "compress";

// current working directory
export const cwd = process.cwd();

// to prevent accidental changes
export const hasPackageJson = fs.existsSync(path.join(cwd, "package.json"));
// to prevent irreversible changes
export const hasGitFolder = fs.existsSync(path.join(cwd, ".git"));

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

// default ESLint config language options // now to be in the resolveConfig package
const jSXTrue = Object.freeze({ jsx: true });
export const typeScriptAndJSXCompatible = {
  // for compatibility with TypeScript (.ts and .tsx)
  parser: tseslint.parser,
  // for compatibility with JSX (React, etc.)
  parserOptions: {
    ecmaFeatures: { ...jSXTrue },
  },
};

// messageId
export const placeholderMessageId = "placeholderMessageId"; // now to be in the resolveConfig package
