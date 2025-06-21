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

// comments.config.js
export const defaultConfigFileName = "comments.config.js";

// flags
export const configFlag = "--config";
export const lintConfigImportsFlag = "--lint-config-imports";
export const myIgnoresOnlyFlag = "--my-ignores-only";

// ESLint ignores
export const knownIgnores = [
  "node_modules",
  ".next",
  ".react-router",
  ".parcel-cache",
  ".react-router-parcel",
  "dist",
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

// regexes
export const configKeyRegex = /^[\p{Ll}\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}\s]+$/u;
export const flattenedConfigKeyRegex = /^[\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}#]+$/u; // same as configKeyRegex but without lowercase letters (\p{Ll}), without whitespaces (\s which are replaced by underscores) and with the '#' character (that links each subkey together)
export const flattenedConfigPlaceholderRegex =
  /\$COMMENT#([\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}_#]+)/gu; // same as flattenedConfigKeyRegex but taking the prefix $COMMENT# into consideration, removing ^ and $ in the capture group, globally
