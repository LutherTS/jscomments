import { ESLint } from "eslint";
import markdown from "@eslint/markdown";

import {
  $COMMENT,
  commentVariablesPluginName,
  extractRuleName,
  typeScriptAndJSXCompatible,
  extractObjectStringLiteralValues,
} from "comment-variables-resolve-config";

import {
  resolveRuleName,
  compressRuleName,
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
 * @param {Record<string, string> | undefined} aliases_flattenedKeys The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias.
 * @returns
 */
const coreCommentsFlow = async (
  ruleName,
  ignores,
  flattenedConfigData,
  aliases_flattenedKeys
) => {
  const eslint = new ESLint({
    fix: true,
    errorOnUnmatchedPattern: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: allJSTSFileGlobs,
        ignores,
        languageOptions: typeScriptAndJSXCompatible,
        plugins: {
          [commentVariablesPluginName]: {
            rules: {
              [ruleName]: ruleNames_makeRules[ruleName](
                flattenedConfigData,
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
        ignores,
        plugins: { markdown },
        processor: "markdown/markdown",
      },
      {
        files: allMDVirtualJSTSFileGlobs,
        ignores,
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
 * @param {Record<string, string>} aliases_flattenedKeys The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias.
 * @returns
 */
export const resolveCommentsFlow = async (
  ignores,
  flattenedConfigData,
  aliases_flattenedKeys
) =>
  coreCommentsFlow(
    resolveRuleName,
    ignores,
    flattenedConfigData,
    aliases_flattenedKeys
  );

/* compressCommentsFlow */

/**
 * The flow that compresses actual comments into `$COMMENT` placeholders.
 * @param {string[]} ignores The array of paths and globs for the flow's ESLint instance to ignore.
 * @param {{[key: string]: string}} reversedFlattenedConfigData The reversed flattened config data, with actual comments as keys and `$COMMENT` placeholders as values.
 * @returns
 */
export const compressCommentsFlow = async (
  ignores,
  reversedFlattenedConfigData
) => coreCommentsFlow(compressRuleName, ignores, reversedFlattenedConfigData);

/* placeholdersCommentsFlow */

/**
 * The flow that creates `$COMMENT` placeholders right next to where they're defined.
 * @param {string[]} configPathIgnores The array of paths linked to the config file, (named "ignores" given it is ignored by the "compress" and "resolve" commands).
 * @param {{[k: string]: string;}} originalFlattenedConfigData The original flattened config data, before changes to Aliases Variables and Composed Variables are applied.
 * @param {Record<string, string>} aliases_flattenedKeys The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias.
 * @returns
 */
export const placeholdersCommentsFlow = async (
  configPathIgnores,
  originalFlattenedConfigData,
  aliases_flattenedKeys
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
        files: configPathIgnores,
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
