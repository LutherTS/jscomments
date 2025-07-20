import fs from "fs";
import path from "path";

// rule names
export const resolveRuleName = "resolve";
export const compressRuleName = "compress";
export const placeholdersRuleName = "placeholders"; // rule?

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
