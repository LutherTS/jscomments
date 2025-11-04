import { ESLint } from "eslint";
import markdown from "@eslint/markdown";

/* TEST START
$COMMENT#HELLO
$COMMENT#GOODBYE
TEST END */

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
 * $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW
 * @param {typeof resolveRuleName | typeof compressRuleName} ruleName $COMMENT#JSDOC#PARAMS#RULENAME
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {{[key: string]: string}} flattenedConfigData $COMMENT#JSDOC#PARAMS#EITHERFLATTENEDCONFIGDATA
 * @param {string[]} composedVariablesExclusives $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVES
 * @param {Record<string, string> | undefined} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
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
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {Record<string, string>} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA
 * @param {string[]} composedVariablesExclusives $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVES
 * @param {Record<string, string>} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
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
 * $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {{[key: string]: string}} reversedFlattenedConfigData $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
 * @param {string[]} composedVariablesExclusives $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVES
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
 * $COMMENT#JSDOC#DEFINITIONS#PLACEHOLDERSCOMMENTSFLOW
 * @param {string[]} configPathIgnores $COMMENT#JSDOC#PARAMS#CONFIGPATHIGNORES
 * @param {{[k: string]: string;}} originalFlattenedConfigData $COMMENT#JSDOC#PARAMS#ORIGINALFLATTENEDCONFIGDATA
 * @param {Record<string, string>} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
 * @param {string} relativeMjsPath $COMMENT#JSDOC#PARAMS#RELATIVEMJSPATH
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
