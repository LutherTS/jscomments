import { ESLint } from "eslint";
import markdown from "@eslint/markdown";

import {
  $COMMENT,
  commentVariablesPluginName,
  extractRuleName,
  resolveRuleName,
  compressRuleName,
  typeScriptAndJSXCompatible,
  extractObjectStringLiteralValues,
} from "comment-variables-resolve-config";

import {
  allJSTSFileGlobs,
  allMDFileGlobs,
  allMDVirtualJSTSFileGlobs,
} from "../constants/bases.js";
import { ruleNames_makeRules } from "../constants/rules.js";

/* coreCommentsFlow */

/**
 * The core flow at the heart of resolving and compressing comments.
 * @param {typeof resolveRuleName | typeof compressRuleName} ruleName The name of the rule currently used. (Either `"resolve"` or `"compress"`.)
 * @param {string[]} ignores The array of paths and globs for the flow's ESLint instance to ignore.
 * @param {{[key: string]: string}} flattenedConfigData Either the flattened config data or the reversed flattened config data, since they share the same structure.
 * @param {string[]} composedVariablesExclusives The array of comment variables keys (implying their aliases as well) exclusively used to craft composed variables, that should be ignored by both the `resolve` and the `compress` commands.
 * @param {Record<string, string> | undefined} aliases_flattenedKeys The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias.
 * @returns
 */
const coreCommentsFlow = async (
  ruleName,
  ignores,
  flattenedConfigData,
  // NEW
  composedVariablesExclusives,
  aliases_flattenedKeys
) => {
  const eslint = new ESLint({
    fix: true,
    ignorePatterns: ignores,
    errorOnUnmatchedPattern: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: allJSTSFileGlobs,
        languageOptions: typeScriptAndJSXCompatible,
        plugins: {
          [commentVariablesPluginName]: {
            rules: {
              [ruleName]: ruleNames_makeRules[ruleName](
                flattenedConfigData,
                // NEW
                composedVariablesExclusives,
                aliases_flattenedKeys
              ),
            },
          },
        },
        rules: {
          [`${commentVariablesPluginName}/${ruleName}`]: "warn",
        },
      },
      {
        files: allMDFileGlobs,
        plugins: { markdown },
        processor: "markdown/markdown",
      },
      {
        files: allMDVirtualJSTSFileGlobs,
        languageOptions: typeScriptAndJSXCompatible,
        rules: {
          [`${commentVariablesPluginName}/${ruleName}`]: "warn",
        },
      },
    ],
  });

  const results = await eslint.lintFiles([
    ...allJSTSFileGlobs,
    ...allMDFileGlobs,
  ]);
  await ESLint.outputFixes(results);

  console.log(`Results for ${ruleName} are:`, results);

  const resolvedOrCompressed =
    ruleName === resolveRuleName
      ? "Resolved"
      : ruleName === compressRuleName
      ? "Compressed"
      : "Unknown rule name'd";

  const total = results.reduce((sum, r) => {
    const add = r.output ? 1 : 0;
    return sum + add;
  }, 0);

  console.log(
    `✅ ${resolvedOrCompressed} comments on ${total} file${
      total === 1 ? "" : "s"
    }.`
  );
};

/* resolveCommentsFlow */

/**
 * The flow that resolves `$COMMENT` placeholders into actual comments.
 * @param {string[]} ignores The array of paths and globs for the flow's ESLint instance to ignore.
 * @param {Record<string, string>} flattenedConfigData The flattened config data, with `$COMMENT` placeholders as keys and actual comments as values.
 * @param {string[]} composedVariablesExclusives The array of comment variables keys (implying their aliases as well) exclusively used to craft composed variables, that should be ignored by both the `resolve` and the `compress` commands.
 * @param {Record<string, string>} aliases_flattenedKeys The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias.
 * @returns
 */
export const resolveCommentsFlow = async (
  ignores,
  flattenedConfigData,
  composedVariablesExclusives,
  aliases_flattenedKeys
) =>
  coreCommentsFlow(
    resolveRuleName,
    ignores,
    flattenedConfigData,
    composedVariablesExclusives,
    aliases_flattenedKeys
  );

/* compressCommentsFlow */

/**
 * The flow that compresses actual comments into `$COMMENT` placeholders.
 * @param {string[]} ignores The array of paths and globs for the flow's ESLint instance to ignore.
 * @param {{[key: string]: string}} reversedFlattenedConfigData The reversed flattened config data, with actual comments as keys and `$COMMENT` placeholders as values.
 * @param {string[]} composedVariablesExclusives The array of comment variables keys (implying their aliases as well) exclusively used to craft composed variables, that should be ignored by both the `resolve` and the `compress` commands.
 * @returns
 */
export const compressCommentsFlow = async (
  ignores,
  reversedFlattenedConfigData,
  composedVariablesExclusives
) =>
  coreCommentsFlow(
    compressRuleName,
    ignores,
    reversedFlattenedConfigData,
    composedVariablesExclusives
  );

/* placeholdersCommentsFlow */

/**
 * The flow that creates `$COMMENT` placeholders right next to where they're defined.
 * @param {string[]} configPathIgnores The array of paths linked to the config file, (named "ignores" given it is ignored by the "compress" and "resolve" commands).
 * @param {{[k: string]: string;}} originalFlattenedConfigData The original flattened config data, before changes to aliases variables and composed variables are applied.
 * @param {Record<string, string>} aliases_flattenedKeys The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias.
 * @param {string} relativeMjsPath The relative path of the generated `.mjs` file to be ignored in the "placeholders" process.
 * @returns
 */
export const placeholdersCommentsFlow = async (
  configPathIgnores,
  originalFlattenedConfigData,
  aliases_flattenedKeys,
  relativeMjsPath
) => {
  /** @type {Record<string, string>} */
  const composedValues_originalKeys = {};
  /** @type {Record<string, string>} */
  const aliasValues_originalKeys = {};
  /** @type {Record<string, string>} */
  const regularValuesOnly_originalKeys = {};

  for (const [key, value] of Object.entries(originalFlattenedConfigData)) {
    if (value.includes(`${$COMMENT}#`))
      // composed variables
      composedValues_originalKeys[value] = key;
    else if (originalFlattenedConfigData[value])
      // alias variables
      aliasValues_originalKeys[value] = aliases_flattenedKeys[key];
    // comment variables
    else regularValuesOnly_originalKeys[value] = key;
  } // no need for continues, potential collisions are caught in resolveConfig run prior

  const makePlaceholders = {
    composedValues_originalKeys,
    aliasValues_originalKeys,
    regularValuesOnly_originalKeys,
    aliases_flattenedKeys,
  };
  const makePlaceholdersAsObject = { makePlaceholders };

  const eslintForMakePlaceholders = new ESLint({
    fix: true,
    errorOnUnmatchedPattern: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        // The .mjs file is considered part of the config path ignores, albeit being a special case since it is "created" by the config rather than imported by it. "placeholders" is the only flow that targets specifically the config path ignores, but its case, the .mjs file should actually be ignored. As such, I make the decision to retain the current integrity of `configPathIgnores`, and to place the mjsPath as an ESLint ignore pattern, where it is required to be relative to `cwd`.
        files: configPathIgnores,
        ignores: [relativeMjsPath], // but the docs say ignorePatterns: https://eslint.org/docs/latest/integrate/nodejs-api#parameters
        languageOptions: typeScriptAndJSXCompatible,
        plugins: {
          [commentVariablesPluginName]: {
            rules: {
              [extractRuleName]: extractObjectStringLiteralValues,
            },
          },
        },
        rules: {
          [`${commentVariablesPluginName}/${extractRuleName}`]: [
            "warn",
            makePlaceholdersAsObject,
          ],
        },
      },
    ],
  });

  const resultsForMakePlaceholders = await eslintForMakePlaceholders.lintFiles(
    configPathIgnores
  );
  await ESLint.outputFixes(resultsForMakePlaceholders);

  console.log("Results for placeholders are:", resultsForMakePlaceholders);

  const total = resultsForMakePlaceholders.reduce((sum, r) => {
    const add = r.output ? 1 : 0;
    return sum + add;
  }, 0);

  console.log(
    `✅ Made placeholders on ${total} file${total === 1 ? "" : "s"}.`
  );
};
