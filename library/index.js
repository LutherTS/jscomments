#!/usr/bin/env node
// The shebang/hashbang (#!) is necessary to communicate with Unix-based systems, like Linux and macOS. On Windows, it is ignored, but npm tooling bridges the gap by generating wrappers that make the CLI work anyway.

import path from "path";
import fs from "fs";
import url from "url";

import prompts from "prompts";

import resolveConfig, {
  defaultConfigFileName,
  templateFileName,
  exampleFileName,
  resolveRuleName,
  compressRuleName,
  placeholdersRuleName,
  configFlag,
  cwd,
  knownIgnores,
  makeResolvedConfigData,
  makeJsonData,
  makeMjsData,
  makeJsonPathLog,
  makeMjsPathLog,
} from "comment-variables-resolve-config";

import {
  hasPackageJson,
  hasGitFolder,
  classic,
  advanced,
} from "./_commons/constants/bases.js";

import { exitDueToFailure, logError } from "./_commons/utilities/helpers.js";
import {
  resolveCommentsFlow,
  compressCommentsFlow,
  placeholdersCommentsFlow,
} from "./_commons/utilities/flows.js";

// GATHERS COMMANDS.

const commands = process.argv;
const coreCommand = commands[2];

const skipDetails =
  coreCommand === resolveRuleName ||
  coreCommand === compressRuleName ||
  coreCommand === placeholdersRuleName;

// ENSURES THE CLI TOOL ONLY RUNS IN FOLDERS THAT POSSESS A package.json FILE AND A .git FOLDER.

if (!hasPackageJson) {
  console.error(
    "ERROR. No package.json file found in this directory. Aborting to prevent accidental changes.",
  );
  exitDueToFailure();
}
skipDetails || console.log("package.json file noticed. Allowed to proceed.");

if (!hasGitFolder) {
  console.error(
    "ERROR. No git folder found in this directory. Aborting to prevent irreversible changes.",
  );
  exitDueToFailure();
}
skipDetails || console.log("git folder noticed. Allowed to proceed.");

// SORTS OUT THE CONFIG PATH.

// extracts the position of the --config flag
const configFlagIndex = commands.indexOf(configFlag);
// determines if there's a valid config flag input
const hasConfigFlag = configFlagIndex >= 2;
// determines if there's an actual config path passed to the config flag
const passedConfig = commands[configFlagIndex + 1];
// gets the absolute passed config path if the --config flag is set
const passedConfigPath =
  hasConfigFlag && passedConfig ? path.join(cwd, passedConfig) : null;
// defaults to comments.config.js if no --config flag is set
let rawConfigPath = passedConfigPath ?? path.join(cwd, defaultConfigFileName);

// HANDLES TUTORIAL MODE.

if (!fs.existsSync(rawConfigPath)) {
  console.log(
    `No Comment Variables config file found at ${rawConfigPath}. Switching to tutorial mode.`,
  );

  /* TEST START (success) */

  const tutorialConfig = {
    templateFilePath: path.join(cwd, templateFileName),
    generateTemplateFilePath: "",
    exampleFilePath: path.join(cwd, exampleFileName), // common to "classic" and "with variations", highlights compatibility
    generateExampleFilePath: "../generate.example.js",
  };

  const classicOrAdvanced = await prompts({
    type: "select",
    name: "value",
    message:
      "Would you like to generate a simple template (classic) or a template with variations (advanced) instead?",
    choices: [
      {
        title: classic,
        description:
          "Simple. For those who discover Comment Variables and have no immediate need for internationalization.",
        value: classic,
      },
      {
        title: advanced,
        description:
          "With variations. For those who know their way around Comment Variables and may want to use its native internationalization features or any configuration of their own that relies on variants.",
        value: advanced,
      },
    ],
    initial: 0,
  });

  /**
   * @type {typeof classic | typeof advanced}
   * `control+C` returns `undefined`.
   */
  const classicOrAdvancedValue = classicOrAdvanced.value;

  if (!classicOrAdvancedValue) {
    console.error(
      "ERROR. No template selected. Please select a template to begin using comment-variables via this CLI.",
    );
    exitDueToFailure();
  }

  switch (classicOrAdvancedValue) {
    case classic:
      tutorialConfig.generateTemplateFilePath = "../generate.template.js";
      break;
    case advanced:
      tutorialConfig.generateTemplateFilePath = "../generate.variations.js";
      break;

    default:
      console.error(
        "ERROR. No template selected. Please select a template to begin using comment-variables via this CLI. (Unreachable code.)", // copypasted same as classicOrAdvanced for now, since this is supposed to be unreachable code.
      );
      exitDueToFailure();
  }

  const {
    templateFilePath,
    generateTemplateFilePath,
    exampleFilePath,
    generateExampleFilePath,
  } = tutorialConfig;

  /* TEST END */

  const dirname = path.dirname(url.fileURLToPath(import.meta.url));

  if (fs.existsSync(templateFilePath)) {
    console.log(`Proceeding with template file found at ${templateFilePath}.`);
  } else {
    const sourceTemplateFilePath = path.join(dirname, generateTemplateFilePath);
    console.log(`Generating template file at ${templateFilePath}.`);
    fs.copyFileSync(sourceTemplateFilePath, templateFilePath);
  }

  if (fs.existsSync(exampleFilePath)) {
    console.log(`Proceeding with example file found at ${exampleFilePath}.`);
  } else {
    const sourceExampleFilePath = path.join(dirname, generateExampleFilePath);
    console.log(`Generating example file at ${exampleFilePath}.`);
    fs.copyFileSync(sourceExampleFilePath, exampleFilePath);
  }

  rawConfigPath = templateFilePath;
}

// RESOLVES THE CONFIG.

console.log(`Resolving config at ${rawConfigPath}...`);

const resolveConfigResults = await resolveConfig(rawConfigPath);
if (!resolveConfigResults.success) {
  resolveConfigResults.errors.forEach((e) => logError(e));
  exitDueToFailure();
}

console.log("Config resolved.");

const {
  configPath,
  passedIgnores,
  config,
  configDataResultsData,
  rawConfigAndImportPaths,
  lintConfigImports,
  myIgnoresOnly,
  composedVariablesExclusives,
  resolvedCoreData,
} = resolveConfigResults;

let {
  // originalFlattenedConfigData, // currently unused as reassigned
  flattenedConfigData,
  reversedFlattenedConfigData,
  aliases_flattenedKeys,
} = resolvedCoreData;

// Completely reassigns these four keys from resolvedCoreData to resolvedVariationData for the CLI.

if (resolveConfigResults.variations) {
  const resolvedVariationData = resolveConfigResults.resolvedVariationData;
  // Reassignments to the variation data. From then on, using data from resolvedCoreData requires using the resolvedCoreData object itself.
  // originalFlattenedConfigData =
  //   resolvedVariationData.originalFlattenedConfigData;
  flattenedConfigData = resolvedVariationData.flattenedConfigData;
  reversedFlattenedConfigData =
    resolvedVariationData.reversedFlattenedConfigData;
  aliases_flattenedKeys = resolvedVariationData.aliases_flattenedKeys;
}

skipDetails || console.log("Running with config:", config);
skipDetails || console.log("Flattened config data is:", flattenedConfigData);
skipDetails ||
  console.log(
    "Reversed flattened config data is:",
    reversedFlattenedConfigData,
  );
skipDetails || console.log("Aliases are:", aliases_flattenedKeys);
skipDetails || console.log("Config path is:", configPath);
skipDetails || console.log("Passed ignores are:", passedIgnores);
skipDetails || console.log("lintConfigImports is:", lintConfigImports);
skipDetails || console.log("myIgnoresOnly are:", myIgnoresOnly);
skipDetails ||
  console.log(
    "Composed variables exclusives are:",
    composedVariablesExclusives,
  );

// ADDRESSES THE --lint-config-imports FLAG (lintConfigImports, no longer a flag), GIVEN THAT THE FILES IMPORTED BY THE CONFIG ARE IGNORED BY DEFAULT.

// instantiates the JSON and .mjs path proactively
const jsonPath = configPath.replace(/\.js$/, () => ".json");
const mjsPath = configPath.replace(/\.js$/, () => ".mjs");

const rawConfigPathIgnores = lintConfigImports
  ? // also ignores the .mjs path
    [configPath, mjsPath]
  : [...rawConfigAndImportPaths, mjsPath];

// the ignore paths must be relative
const configPathIgnores = rawConfigPathIgnores.map((e) =>
  path.relative(cwd, e),
);

skipDetails ||
  console.log(
    lintConfigImports ? "Config path ignore is:" : "Config path ignores are:",
    configPathIgnores,
  );

// ADDRESSES THE --my-ignores-only FLAG (myIgnoresOnly, no longer a flag, GIVEN THAT KNOWN IGNORES ARE IGNORED BY DEFAULT.

const rawIgnores = [...configPathIgnores, ...passedIgnores];
const ignores = myIgnoresOnly ? rawIgnores : [...rawIgnores, ...knownIgnores];

skipDetails || console.log("Ignores are:", ignores);

// AUTOMATICALLY GENERATES THE JSON OUTPUT OF YOUR RESOLVED CONFIG DATA.

const makeResolvedConfigDataResults = makeResolvedConfigData(
  configDataResultsData,
  resolvedCoreData.flattenedConfigData,
  resolvedCoreData.aliases_flattenedKeys,
);
if (!makeResolvedConfigDataResults.success) {
  makeResolvedConfigDataResults.errors.forEach((e) => logError(e));
  exitDueToFailure();
}

const { resolvedConfigData } = makeResolvedConfigDataResults;

const jsonData = makeJsonData(resolvedConfigData);
fs.writeFileSync(jsonPath, jsonData, "utf8");

console.log(makeJsonPathLog(jsonPath));

// comments.config.mjs to directly access resolvedConfigData.

const mjsData = makeMjsData(resolvedConfigData);
fs.writeFileSync(mjsPath, mjsData, "utf8");

console.log(makeMjsPathLog(mjsPath));

// ADDRESSES THE CORE COMMANDS "resolve", "compress", AND "placeholders".

switch (coreCommand) {
  case resolveRuleName:
    console.log(`Running ${resolveRuleName}...`);
    await resolveCommentsFlow(
      ignores,
      flattenedConfigData,
      composedVariablesExclusives,
      aliases_flattenedKeys,
    );
    break;
  case compressRuleName:
    console.log(`Running ${compressRuleName}...`);
    await compressCommentsFlow(
      ignores,
      reversedFlattenedConfigData,
      composedVariablesExclusives,
    );
    break;
  // I'm noticing I'm not even using valueLocations to create placeholders. Which is in fact more reliable because I'm appending the placeholders specifically to the object string values that I find instead of doing so from locations.
  case placeholdersRuleName:
    console.log(`Running ${placeholdersRuleName}...`);
    await placeholdersCommentsFlow(
      configPathIgnores,
      resolvedCoreData.originalFlattenedConfigData,
      resolvedCoreData.aliases_flattenedKeys,
      path.relative(cwd, mjsPath),
      resolveConfigResults.variations,
    );
    break;
  default:
    if (coreCommand && !coreCommand.startsWith("--"))
      console.error(
        `ERROR. Core command not recognized. Choose between "${resolveRuleName}" and "${compressRuleName}" or "${placeholdersRuleName}".`,
      );
    else
      console.log(
        `If these settings are correct with you, feel free to initiate the command "${resolveRuleName}" to resolve comments, or "${compressRuleName}" to compress them back to their $COMMENT forms. You can also generate the placeholders at their definitions locations with the command "${placeholdersRuleName}".${
          passedConfigPath ? " (And DON'T FORGET YOUR --config FLAG!)" : ""
        }`,
      );
    break;
}
