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

import makeResolveRule from "../rules/resolve.js";
import makeCompressRule from "../rules/compress.js";

const coreCommentsFlow = async (
  ruleName,
  ignores,
  makeCommentsRule,
  flattenedConfigData
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
              [ruleName]: makeCommentsRule(flattenedConfigData),
            },
          },
        },
        rules: {
          [`${commentVariablesPluginName}/${ruleName}`]: "warn", // doesn't block builds, just applies fix
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

  console.log({ results });

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

export const resolveCommentsFlow = async (ignores, flattenedConfigData) =>
  coreCommentsFlow(
    resolveRuleName,
    ignores,
    makeResolveRule,
    flattenedConfigData
  );

export const compressCommentsFlow = async (
  ignores,
  reversedFlattenedConfigData
) =>
  coreCommentsFlow(
    compressRuleName,
    ignores,
    makeCompressRule,
    reversedFlattenedConfigData
  );
