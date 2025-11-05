#!/usr/bin/env node
// The shebang/hashbang (#!) is necessary to communicate with Unix-based systems, like Linux and macOS. On Windows, it is ignored, but npm tooling bridges the gap by generating wrappers that make the CLI work anyway.

import path from "path";
import fs from "fs";
import url from "url";

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

import { hasPackageJson, hasGitFolder } from "./_commons/constants/bases.js";

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
    "ERROR. No package.json file found in this directory. Aborting to prevent accidental changes."
  );
  exitDueToFailure();
}
skipDetails || console.log("package.json file noticed. Allowed to proceed.");

if (!hasGitFolder) {
  console.error(
    "ERROR. No git folder found in this directory. Aborting to prevent irreversible changes."
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
    `No Comment Variables config file found at ${rawConfigPath}. Switching to tutorial mode.`
  );

  const templateFilePath = path.join(cwd, templateFileName);
  const exampleFilePath = path.join(cwd, exampleFileName);
  const dirname = path.dirname(url.fileURLToPath(import.meta.url));

  if (fs.existsSync(templateFilePath)) {
    console.log(`Proceeding with template file found at ${templateFilePath}.`);
  } else {
    const sourceTemplateFilePath = path.join(
      dirname,
      "../generate.template.js"
    );
    console.log(`Generating template file at ${templateFilePath}.`);
    fs.copyFileSync(sourceTemplateFilePath, templateFilePath);
  }

  if (fs.existsSync(exampleFilePath)) {
    console.log(`Proceeding with example file found at ${exampleFilePath}.`);
  } else {
    const sourceExampleFilePath = path.join(dirname, "../generate.example.js");
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
  originalFlattenedConfigData,
  flattenedConfigData,
  reversedFlattenedConfigData,
  aliases_flattenedKeys,
} = resolvedCoreData;

// Completely reassigns these four keys from resolvedCoreData to resolvedVariationData for the CLI.

if (resolveConfigResults.variations) {
  const resolvedVariationData = resolveConfigResults.resolvedVariationData;
  // Reassignments to the variation data. From then on, using data from resolvedCoreData requires using the resolvedCoreData object itself.
  originalFlattenedConfigData =
    resolvedVariationData.originalFlattenedConfigData;
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
    reversedFlattenedConfigData
  );
skipDetails || console.log("Aliases are:", aliases_flattenedKeys);
skipDetails || console.log("Config path is:", configPath);
skipDetails || console.log("Passed ignores are:", passedIgnores);
skipDetails || console.log("lintConfigImports is:", lintConfigImports);
skipDetails || console.log("myIgnoresOnly are:", myIgnoresOnly);
// NEW
skipDetails ||
  console.log(
    "Composed variables exclusives are:",
    composedVariablesExclusives
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
  path.relative(cwd, e)
);

skipDetails ||
  console.log(
    lintConfigImports ? "Config path ignore is:" : "Config path ignores are:",
    configPathIgnores
  );

// ADDRESSES THE --my-ignores-only FLAG (myIgnoresOnly, no longer a flag, GIVEN THAT KNOWN IGNORES ARE IGNORED BY DEFAULT.

const rawIgnores = [...configPathIgnores, ...passedIgnores];
const ignores = myIgnoresOnly ? rawIgnores : [...rawIgnores, ...knownIgnores];

skipDetails || console.log("Ignores are:", ignores);

// AUTOMATICALLY GENERATES THE JSON OUTPUT OF YOUR RESOLVED CONFIG DATA.

const makeResolvedConfigDataResults = makeResolvedConfigData(
  configDataResultsData,
  resolvedCoreData.flattenedConfigData,
  resolvedCoreData.aliases_flattenedKeys
);
if (!makeResolvedConfigDataResults.success) {
  makeResolvedConfigDataResults.errors.forEach((e) => logError(e));
  exitDueToFailure();
}

const { resolvedConfigData } = makeResolvedConfigDataResults;

const jsonData = makeJsonData(resolvedConfigData);
fs.writeFileSync(jsonPath, jsonData, "utf8");

console.log(makeJsonPathLog(jsonPath));

// NEW!! comments.config.mjs to directly access resolvedConfigData.

const mjsData = makeMjsData(resolvedConfigData);
fs.writeFileSync(mjsPath, mjsData, "utf8");

console.log(makeMjsPathLog(mjsPath));

// ADDRESSES THE CORE COMMANDS "resolve", "compress", AND "placeholders".

// ...The complexity here lies in the fact that I need to make completely virtualized data that will be used by the flows below to resolve according to the ongoing variation, notably for alias and composed variables. So that means, all prefix have to go, but also only the current variant need to be taken into account.
console.debug("flattenedConfigData is:", flattenedConfigData);
console.debug("reversedFlattenedConfigData is:", reversedFlattenedConfigData);
console.debug("composedVariablesExclusives are:", composedVariablesExclusives);
console.debug("aliases_flattenedKeys are:", aliases_flattenedKeys);

switch (coreCommand) {
  case resolveRuleName:
    console.log(`Running ${resolveRuleName}...`);
    await resolveCommentsFlow(
      ignores,
      flattenedConfigData,
      composedVariablesExclusives,
      aliases_flattenedKeys
    );
    break;
  case compressRuleName:
    console.log(`Running ${compressRuleName}...`);
    await compressCommentsFlow(
      ignores,
      reversedFlattenedConfigData,
      composedVariablesExclusives
    );
    break;
  // I'm noticing I'm not even using valueLocations to create placeholders.
  case placeholdersRuleName:
    console.log(`Running ${placeholdersRuleName}...`);
    await placeholdersCommentsFlow(
      configPathIgnores,
      originalFlattenedConfigData,
      aliases_flattenedKeys,
      path.relative(cwd, mjsPath)
    );
    break;
  default:
    if (coreCommand && !coreCommand.startsWith("--"))
      console.error(
        `ERROR. Core command not recognized. Choose between "${resolveRuleName}" and "${compressRuleName}" or "${placeholdersRuleName}".`
      );
    else
      console.log(
        `If these settings are correct with you, feel free to initiate the command "${resolveRuleName}" to resolve comments, or "${compressRuleName}" to compress them back to their $COMMENT forms. You can also generate the placeholders at their definitions locations with the command "${placeholdersRuleName}".${
          passedConfigPath ? " (And DON'T FORGET YOUR --config FLAG!)" : ""
        }`
      );
    break;
}
