import { ESLint } from "eslint";
import markdown from "@eslint/markdown";

import {
  commentVariablesPluginName,
  resolveRuleName,
  compressRuleName,
  allJSTSFileGlobs,
  allMDFileGlobs,
  allMDVirtualJSTSFileGlobs,
  typeScriptAndJSXCompatible,
} from "../constants/bases.js";
import { ruleNames_makeRules } from "../constants/rules.js";

/* coreCommentsFlow */

/**
 * The core flow at the heart of resolving and compressing comments.
 * @param {typeof resolveRuleName | typeof compressRuleName} ruleName The name of the rule currently used. (Either `"resolve"` or `"compress"`.)
 * @param {string[]} ignores The array of paths and globs for the flow's ESLint instance to ignore.
 * @param {{[key: string]: string}} flattenedConfigData Either the flattened config data or the reversed flattened config data, since they share the same structure.
 */
const coreCommentsFlow = async (ruleName, ignores, flattenedConfigData) => {
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
              [ruleName]: ruleNames_makeRules[ruleName](flattenedConfigData),
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
 * @returns
 */
export const resolveCommentsFlow = async (ignores, flattenedConfigData) =>
  coreCommentsFlow(resolveRuleName, ignores, flattenedConfigData);

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
