import { ESLint } from "eslint";
import markdown from "@eslint/markdown";

import {
  commentVariablesPluginName,
  typeScriptAndJSXCompatible,
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

// $COMMENT#LEVELONE#STILLLEVELTHREE

/**
 * The core flow at the heart of resolving and compressing comments.
 * @param {typeof resolveRuleName | typeof compressRuleName} ruleName The name of the rule currently used. (Either `"resolve"` or `"compress"`.)
 * @param {string[]} ignores The array of paths and globs for the flow's ESLint instance to ignore.
 * @param {{[key: string]: string}} flattenedConfigData Either the flattened config data or the reversed flattened config data, since they share the same structure.
 * @param {{[key: string]: string} | undefined} aliases_flattenedKeys
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

  console.log("Results are:", results);

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
 * The flow that resolves $COMMENT#* placeholders intro actual comments.
 * @param {string[]} ignores The array of paths and globs for the flow's ESLint instance to ignore.
 * @param {{[key: string]: string}} flattenedConfigData The flattened config data, with $COMMENT#* placeholders as keys and actual comments as values.
 * @param {{[key: string]: string}} aliases_flattenedKeys
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
 * The flow that compresses actual comments into $COMMENT#* placeholders.
 * @param {string[]} ignores The array of paths and globs for the flow's ESLint instance to ignore.
 * @param {{[key: string]: string}} reversedFlattenedConfigData The reversed flattened config data, with actual comments as keys and $COMMENT#* placeholders as values.
 * @returns
 */
export const compressCommentsFlow = async (
  ignores,
  reversedFlattenedConfigData
) => coreCommentsFlow(compressRuleName, ignores, reversedFlattenedConfigData);
