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
 * $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW
 * @param {typeof resolveRuleName | typeof compressRuleName} ruleName $COMMENT#JSDOC#PARAMS#RULENAME
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {{[key: string]: string}} flattenedConfigData $COMMENT#JSDOC#PARAMS#EITHERFLATTENEDCONFIGDATA
 * @param {Record<string, string> | undefined} aliases_flattenedKeys
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
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {Record<string, string>} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA
 * @param {Record<string, string>} aliases_flattenedKeys
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
 * $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {{[key: string]: string}} reversedFlattenedConfigData $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
 * @returns
 */
export const compressCommentsFlow = async (
  ignores,
  reversedFlattenedConfigData
) => coreCommentsFlow(compressRuleName, ignores, reversedFlattenedConfigData);

/* placeholdersCommentsFlow */

/**
 *
 * @param {string[]} configPathIgnores
 * @param {{[k: string]: string;}} originalFlattenedConfigData
 * @param {Record<string, string>} aliases_flattenedKeys
 */
export const placeholdersCommentsFlow = async (
  configPathIgnores,
  originalFlattenedConfigData,
  aliases_flattenedKeys
) => {
  /* TEST START
  only for the jscomments/comment-variables placeholders command
  meaning this should actually be only in the JSComments CLI, */

  /** @type {Record<string, string>} */
  const composedValues_originalKeys = {};
  /** @type {Record<string, string>} */
  const aliasValues_originalKeys = {};
  /** @type {Record<string, string>} */
  const regularValuesOnly_originalKeys = {};

  for (const [key, value] of Object.entries(originalFlattenedConfigData)) {
    if (value.includes(`${$COMMENT}#`))
      // composed Comment Variables
      composedValues_originalKeys[value] = key;
    else if (originalFlattenedConfigData[value])
      // alias Comment Variables
      aliasValues_originalKeys[value] = aliases_flattenedKeys[key];
    // regular Comment Variables
    else regularValuesOnly_originalKeys[value] = key;
  } // no need for continues, potential collisions are caught in resolveConfig run prior

  const makePlaceholders = {
    composedValues_originalKeys,
    aliasValues_originalKeys,
    regularValuesOnly_originalKeys,
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
  /* TEST END */
};
