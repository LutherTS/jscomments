#!/usr/bin/env node
// The hashbang (#!) is necessary to communicate with Unix-based systems, like Linux and macOS. On Windows, it is ignored, but npm tooling bridges the gap by generating wrappers that make the CLI work anyway.

import path from "path";
import fs from "fs";

import { ESLint } from "eslint";

import { runWithConfig } from "./run-with-config.js";
import {
  findAllImports,
  typeScriptAndJSXCompatible,
} from "./find-all-imports.js";

const cwd = process.cwd();

// ENSURES THE CLI TOOL ONLY RUN IN FOLDERS THAT POSSESS A package.json FILE AND A .git FOLDER.

const hasPackageJson = fs.existsSync(path.join(cwd, "package.json"));
if (!hasPackageJson) {
  console.error(
    "ERROR. No package.json file found in this directory. Aborting to prevent accidental changes."
  );
  process.exit(1);
}
const hasGitFolder = fs.existsSync(path.join(cwd, ".git"));
if (!hasGitFolder) {
  console.error(
    "ERROR. No git folder found in this directory. Aborting to prevent irreversible changes."
  );
  process.exit(1);
}

// GATHERS COMMANDS.

const commands = process.argv;

// OBTAINS THE VALIDATED FLATTENED CONFIG, REVERSE FLATTENED CONFIG, AND CONFIG PATH.

const configFlagIndex = commands.indexOf("--config");
const passedConfigPath =
  configFlagIndex >= 2 ? path.join(cwd, commands[configFlagIndex + 1]) : null;
const rawConfigPath = passedConfigPath ?? path.join(cwd, "comments.config.js");

const results = await runWithConfig(rawConfigPath);
if (!results) process.exit(1);

const { flattenedConfig, reversedFlattenedConfig, configPath } = results;
console.log("Config path is:", configPath);
console.log("Verified flattened config is:", flattenedConfig);
console.log("Reversed flattened config is:", reversedFlattenedConfig);

const keys = new Set([...Object.keys(flattenedConfig)]);
const values = new Set([...Object.values(flattenedConfig)]);

// VALIDATES ONE LAST TIME THE REVERSABILITY OF flattenedConfig AND reversedFlattenedConfig.

keys.forEach((key) => {
  if (values.has(key)) {
    console.error(
      `The key "${key}" is and shouldn't be among the values of flattenedConfig.`
    );
    process.exit(1);
  }
});

// ADDRESSES THE --include-config-imports FLAG, GIVEN THAT THE FILES IMPORTED BY THE CONFIG ARE IGNORED BY DEFAULT.

const includeConfigImports = commands.indexOf("--include-config-imports") >= 2;
const rawConfigIgnores = includeConfigImports
  ? [configPath]
  : [...findAllImports(configPath)];

// the ignore paths must be relative
const configIgnores = rawConfigIgnores.map((e) => path.relative(cwd, e));
console.log(
  includeConfigImports ? "Config ignore is:" : "Config ignores are",
  configIgnores
);

// DEFINES DEFAULT ESLINT IGNORES AND FILES.

const knownIgnores = [
  ".next",
  ".react-router",
  "node_modules",
  ".parcel-cache",
  ".react-router-parcel",
  "dist",
];

const allJSTSFileGlobs = [
  "**/*.tsx",
  "**/*.ts",
  "**/*.jsx",
  "**/*.js",
  "**/*.mjs",
  "**/*.cjs",
];

// MAKES THE FLOW FOR resolveCommentsInProject.

/** @type {import('@typescript-eslint/utils').TSESLint.RuleModule<string, []>} */
const jsCommentsRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Resolve $COMMENT#... using js-comments config.",
    },
    messages: {
      message: `Resolved $COMMENT placeholder(s) in comment.`,
    },
    fixable: "code",
    schema: [],
  },
  create: (context) => {
    const sourceCode = context.sourceCode;
    const comments = sourceCode
      .getAllComments()
      .filter((e) => e.type !== "Shebang");

    for (const comment of comments) {
      const matches = [...comment.value.matchAll(/\$COMMENT#([A-Z0-9#_]+)/g)];

      if (matches.length === 0) continue;

      let fixedText = comment.value;
      let hasValidFix = false;

      for (const match of matches) {
        const fullMatch = match[0]; // e.g. $COMMENT#LEVELONE#LEVELTWO
        const key = match[1]; // e.g. LEVELONE#LEVELTWO
        const replacement = flattenedConfig[key];

        if (replacement) {
          fixedText = fixedText.replace(fullMatch, replacement);
          hasValidFix = true;
        }
      }

      if (hasValidFix && fixedText !== comment.value) {
        context.report({
          loc: comment.loc,
          messageId: "message",
          fix(fixer) {
            const range = comment.range;
            const prefix = comment.type === "Block" ? "/*" : "//";
            const suffix = comment.type === "Block" ? "*/" : "";
            const newComment = `${prefix}${fixedText}${suffix}`;

            return fixer.replaceTextRange(range, newComment);
          },
        });
      }
    }

    return {};
  },
};

async function resolveCommentsInProject(fileGlobs = allJSTSFileGlobs) {
  const ruleName = "js-comments/js-comments-autofix";

  const eslint = new ESLint({
    fix: true,
    errorOnUnmatchedPattern: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: fileGlobs,
        ignores: [...configIgnores, ...knownIgnores], // 🚫 Ensure config isn't linted
        languageOptions: typeScriptAndJSXCompatible,
        plugins: {
          "js-comments": {
            rules: {
              "js-comments-autofix": jsCommentsRule,
            },
          },
        },
        rules: {
          [ruleName]: "warn", // Don't block builds, just apply fix
        },
      },
    ],
  });

  const results = await eslint.lintFiles(fileGlobs);
  await ESLint.outputFixes(results);

  console.log({ results });

  const total = results.reduce((sum, r) => {
    const add = r.output ? 1 : 0;
    return sum + add;
  }, 0);
  console.log(`✅ Resolved ${total} comment${total === 1 ? "" : "s"}.`);
}

// MAKES THE FLOW FOR compressCommentsInProject.

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const makeReverseJsCommentsRule = (reversedFlattenedConfig) => {
  // Sort the resolved values by descending length to prevent partial replacements.
  const sortedReversedFlattenedConfig = Object.entries(
    reversedFlattenedConfig
  ).sort(([a], [b]) => b.length - a.length);

  /** @type {import('@typescript-eslint/utils').TSESLint.RuleModule<string, []>} */
  const reverseJsCommentsRule = {
    meta: {
      type: "suggestion",
      docs: {
        description: "Resolve $COMMENT#... using js-comments config in reverse",
      },
      messages: {
        message: `Comment compressed.`,
      },
      fixable: "code",
      schema: [],
    },
    create(context) {
      const sourceCode = context.sourceCode;
      const comments = sourceCode
        .getAllComments()
        .filter((e) => e.type !== "Shebang");

      for (const comment of comments) {
        let fixedText = comment.value;
        let modified = false;

        for (const [
          resolvedValue,
          commentKey,
        ] of sortedReversedFlattenedConfig) {
          const pattern = new RegExp(
            `(?<=\\s|^)${escapeRegex(resolvedValue)}(?=\\s|$)`,
            "g"
          );

          fixedText = fixedText.replace(pattern, () => {
            modified = true;
            return `$COMMENT#${commentKey}`;
          });
        }

        if (modified && fixedText !== comment.value) {
          context.report({
            loc: comment.loc,
            messageId: "message",
            fix(fixer) {
              const fullCommentText =
                comment.type === "Block"
                  ? `/*${fixedText}*/`
                  : `//${fixedText}`;
              return fixer.replaceText(comment, fullCommentText);
            },
          });
        }
      }

      return {};
    },
  };

  return reverseJsCommentsRule;
};

async function compressCommentsInProject(fileGlobs = allJSTSFileGlobs) {
  const ruleName = "js-comments/js-comments-autofix";

  const eslint = new ESLint({
    fix: true,
    errorOnUnmatchedPattern: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: fileGlobs,
        ignores: [...configIgnores, ...knownIgnores], // 🚫 Ensure config isn't linted
        languageOptions: typeScriptAndJSXCompatible,
        plugins: {
          "js-comments": {
            rules: {
              "js-comments-autofix": makeReverseJsCommentsRule(
                reversedFlattenedConfig
              ),
            },
          },
        },
        rules: {
          [ruleName]: "warn", // Don't block builds, just apply fix
        },
      },
    ],
  });

  const results = await eslint.lintFiles(fileGlobs);
  await ESLint.outputFixes(results);

  console.log({ results });

  const total = results.reduce((sum, r) => {
    const add = r.output ? 1 : 0;
    return sum + add;
  }, 0);
  console.log(`✅ Compressed ${total} comment${total === 1 ? "" : "s"}.`);
}

// ADDRESSES THE CORE COMMANDS "resolve" AND "compress".

const coreCommand = commands[2];

switch (coreCommand) {
  case "resolve":
    await resolveCommentsInProject();
    break;
  case "compress":
    await compressCommentsInProject();
    break;
  case undefined:
    console.log(
      `If these settings are correct with you, feel free to initiate the command "resolve" to resolve comments, or "compress" to compress them back to their $COMMENT#* forms.`
    );
    break;
  default:
    console.log(
      `Core command not recognized. Choose between "resolve" and "compress".`
    );
    break;
}

/* Notes
I'm going to have to redo this, but for now I just want to vibe code it in order to see how it is possible to make this. 
*/
