#!/usr/bin/env node
// The shebang (#!) is necessary to communicate with Unix-based systems, like Linux and macOS. On Windows, it is ignored, but npm tooling bridges the gap by generating wrappers that make the CLI work anyway.

import path from "path";

import {
  cwd,
  hasPackageJson,
  hasGitFolder,
  defaultConfigFileName,
  configFlag,
  lintConfigImportsFlag,
  myIgnoresOnlyFlag,
  knownIgnores,
  resolveRuleName,
  compressRuleName,
} from "./_commons/constants/bases.js";

import { exitDueToFailure } from "./_commons/utilities/helpers.js";
import { resolveConfig } from "./_commons/utilities/resolve-config.js";
import { findAllImports } from "./_commons/utilities/find-all-imports.js";
import {
  resolveCommentsFlow,
  compressCommentsFlow,
} from "./_commons/utilities/flows.js";

// ENSURES THE CLI TOOL ONLY RUNS IN FOLDERS THAT POSSESS A package.json FILE AND A .git FOLDER.

if (!hasPackageJson) {
  console.error(
    "ERROR. No package.json file found in this directory. Aborting to prevent accidental changes."
  );
  exitDueToFailure();
}
if (!hasGitFolder) {
  console.error(
    "ERROR. No git folder found in this directory. Aborting to prevent irreversible changes."
  );
  exitDueToFailure();
}

// GATHERS COMMANDS.

const commands = process.argv;
const coreCommand = commands[2];

const skipDetails =
  coreCommand === resolveRuleName || coreCommand === compressRuleName;

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
const rawConfigPath = passedConfigPath ?? path.join(cwd, defaultConfigFileName);

const results = await resolveConfig(rawConfigPath);
if (!results) {
  exitDueToFailure();
}

const {
  config,
  flattenedConfigData,
  reversedFlattenedConfigData,
  configPath,
  passedIgnores,
} = results;

!skipDetails && console.log("Running with config:", config);
!skipDetails && console.log("Flattened config is:", flattenedConfigData);
!skipDetails &&
  console.log("Reversed flattened config is:", reversedFlattenedConfigData);
!skipDetails && console.log("Config path is:", configPath);
!skipDetails && console.log("Passed ignores are:", passedIgnores);

// ADDRESSES THE --lint-config-imports FLAG, GIVEN THAT THE FILES IMPORTED BY THE CONFIG ARE IGNORED BY DEFAULT.

const lintConfigImports = commands.indexOf(lintConfigImportsFlag) >= 2;
const rawConfigPathIgnores = lintConfigImports
  ? [configPath]
  : [...(findAllImports(configPath) ?? [])];

// the ignore paths must be relative
const configPathIgnores = rawConfigPathIgnores.map((e) =>
  path.relative(cwd, e)
);

!skipDetails &&
  console.log(
    lintConfigImports ? "Config path ignore is:" : "Config path ignores are:",
    configPathIgnores
  );

// ADDRESSES THE --my-ignores-only FLAG, GIVEN THAT KNOWN IGNORES ARE IGNORED BY DEFAULT

const myIgnoresOnly = commands.indexOf(myIgnoresOnlyFlag) >= 2;
const rawIgnores = [...configPathIgnores, ...passedIgnores];
const ignores = myIgnoresOnly ? rawIgnores : [...rawIgnores, ...knownIgnores];

!skipDetails && console.log("Ignores are:", ignores);

// ADDRESSES THE CORE COMMANDS "resolve" AND "compress".

switch (coreCommand) {
  case resolveRuleName:
    console.log(`Running ${resolveRuleName}...`);
    await resolveCommentsFlow(ignores, flattenedConfigData);
    break;
  case compressRuleName:
    console.log(`Running ${compressRuleName}...`);
    await compressCommentsFlow(ignores, reversedFlattenedConfigData);
    break;
  default:
    if (coreCommand && !coreCommand.startsWith("--"))
      console.error(
        `ERROR. Core command not recognized. Choose between "resolve" and "compress".`
      );
    else
      console.log(
        `If these settings are correct with you, feel free to initiate the command "resolve" to resolve comments, or "compress" to compress them back to their $COMMENT#* forms.${
          passedConfigPath || lintConfigImports || myIgnoresOnly
            ? " (And DON'T FORGET YOUR FLAGS!)"
            : ""
        }`
      );
    break;
}
