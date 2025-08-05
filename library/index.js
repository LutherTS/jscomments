#!/usr/bin/env node
// The shebang (#!) is necessary to communicate with Unix-based systems, like Linux and macOS. On Windows, it is ignored, but npm tooling bridges the gap by generating wrappers that make the CLI work anyway.

import path from "path";
import fs from "fs";
import url from "url";

import resolveConfig, {
  defaultConfigFileName,
  templateFileName,
  exampleFileName,
  configFlag,
  cwd,
  knownIgnores,
  makeResolvedConfigData,
} from "comment-variables-resolve-config";

import {
  hasPackageJson,
  hasGitFolder,
  resolveRuleName,
  compressRuleName,
  placeholdersRuleName,
  startRuleName,
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

/* TEST START */

// IMMEDIATELY HANDLES THE START COMMAND (that's a flow, startFlow)

if (coreCommand === startRuleName) {
  const templateFilePath = path.join(cwd, templateFileName);
  if (!fs.existsSync(templateFilePath)) {
    console.error(
      `ERROR. ${templateFilePath} does not exist. Cancelling "start" command.`
    );
    exitDueToFailure();
  }
  const templateJsonPath = templateFilePath.replace(/\.js$/, () => ".json");
  if (!fs.existsSync(templateJsonPath)) {
    console.error(
      `ERROR. ${templateJsonPath} does not exist. Cancelling "start" command.`
    );
    exitDueToFailure();
  }

  const defaultConfigFilePath = path.join(cwd, defaultConfigFileName);
  if (fs.existsSync(defaultConfigFilePath)) {
    console.error(
      `ERROR. ${defaultConfigFilePath} already exists. Cancelling "start" command.`
    );
    exitDueToFailure();
  }
  const defaultConfigJsonPath = defaultConfigFilePath.replace(
    /\.js$/,
    () => ".json"
  );
  if (fs.existsSync(defaultConfigJsonPath)) {
    console.error(
      `ERROR. ${defaultConfigJsonPath} already exists. Cancelling "start" command.`
    );
    exitDueToFailure();
  }

  fs.renameSync(templateFilePath, defaultConfigFilePath);
  fs.renameSync(templateJsonPath, defaultConfigJsonPath);

  console.log("Template files successfully renamed to config files.");
  console.log(
    "Congratulations on completing the Comment Variables tutorial. We wish you the best in your Comment Variables experience."
  );

  process.exit(0);
}

/* TEST END */

// OBTAINS THE VALIDATED FLATTENED CONFIG, REVERSE FLATTENED CONFIG, CONFIG PATH, AND PASSED IGNORES.

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

// HANDLES TUTORIAL MODE (that's a flow, tutorialFlow)

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

// RESOLVES THE CONFIG

console.log(`Resolving config at ${rawConfigPath}...`);

const resolveConfigResults = await resolveConfig(rawConfigPath);
if (!resolveConfigResults.success) {
  resolveConfigResults.errors.forEach((e) => logError(e));
  exitDueToFailure();
}

console.log("Config resolved.");

const {
  config,
  originalFlattenedConfigData,
  flattenedConfigData,
  reversedFlattenedConfigData,
  aliases_flattenedKeys,
  configPath,
  passedIgnores,
  rawConfigAndImportPaths,
  // NEW
  lintConfigImports,
  myIgnoresOnly,
} = resolveConfigResults;

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
// NEW
skipDetails || console.log("lintConfigImports is:", lintConfigImports);
skipDetails || console.log("myIgnoresOnly are:", myIgnoresOnly);

// ADDRESSES THE --lint-config-imports FLAG (lintConfigImports, no longer a flag), GIVEN THAT THE FILES IMPORTED BY THE CONFIG ARE IGNORED BY DEFAULT.

// const lintConfigImports = commands.indexOf(lintConfigImportsFlag) >= 2; // NOW FROM CONFIG
const rawConfigPathIgnores = lintConfigImports
  ? [configPath]
  : rawConfigAndImportPaths;

// the ignore paths must be relative
const configPathIgnores = rawConfigPathIgnores.map((e) =>
  path.relative(cwd, e)
);

skipDetails ||
  console.log(
    lintConfigImports ? "Config path ignore is:" : "Config path ignores are:",
    configPathIgnores
  );

// ADDRESSES THE --my-ignores-only FLAG (myIgnoresOnly, no longer a flag, GIVEN THAT KNOWN IGNORES ARE IGNORED BY DEFAULT

// const myIgnoresOnly = commands.indexOf(myIgnoresOnlyFlag) >= 2; // NOW FROM CONFIG
const rawIgnores = [...configPathIgnores, ...passedIgnores];
const ignores = myIgnoresOnly ? rawIgnores : [...rawIgnores, ...knownIgnores];

skipDetails || console.log("Ignores are:", ignores);

// NEW: AUTOMATICALLY GENERATE THE JSON OUTPUT OF YOUR RESOLVED CONFIG DATA.

const makeResolvedConfigDataResults =
  makeResolvedConfigData(resolveConfigResults);
if (!makeResolvedConfigDataResults.success) {
  makeResolvedConfigDataResults.errors.forEach((e) => logError(e));
  exitDueToFailure();
}

const resolvedConfigData = makeResolvedConfigDataResults.resolvedConfigData;
const jsonPath = resolveConfigResults.configPath.replace(
  /\.js$/,
  () => ".json"
);
const jsonData = JSON.stringify(resolvedConfigData, null, 2);
fs.writeFileSync(jsonPath, jsonData, "utf8");

console.log(`JSON resolved config data written to: \n${jsonPath}`);

// ADDRESSES THE CORE COMMANDS "resolve", "compress", AND "placeholders".

switch (coreCommand) {
  case resolveRuleName:
    console.log(`Running ${resolveRuleName}...`);
    await resolveCommentsFlow(
      ignores,
      flattenedConfigData,
      aliases_flattenedKeys
    );
    break;
  case compressRuleName:
    console.log(`Running ${compressRuleName}...`);
    await compressCommentsFlow(ignores, reversedFlattenedConfigData);
    break;
  case placeholdersRuleName:
    console.log(`Running ${placeholdersRuleName}...`);
    await placeholdersCommentsFlow(
      configPathIgnores,
      originalFlattenedConfigData,
      aliases_flattenedKeys
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
