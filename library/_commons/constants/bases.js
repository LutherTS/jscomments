import fs from "fs";
import path from "path";

import { cwd } from "comment-variables-resolve-config";

// rule names (now inside "comment-variables-resolve-config")
// export const resolveRuleName = "resolve";
// export const compressRuleName = "compress";
// export const placeholdersRuleName = "placeholders"; // rule?

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
