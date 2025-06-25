const data = {
  // for testing
  levelOne: {
    levelTwo: {
      levelThree: "Level three.",
      // levelthree: "Also level three.", // errors, duplicate normalized key
      // stillLevelThree: "LEVELONE#LEVELTWO#LEVELTHREE", // errors, value is also a normalized key
      // alsoLevelThree: "Level three.", // errors, duplicate value
      // tooLevelThree: 2, // errors, value is invalid
      // $levelThree: "Dollar sign", // errors, key as "$" character
      // "#levelThree": "Hashtag", // errors, key as "#" character
      // ".levelThree": "Punctuation", // errors, key is invalid
    },
  },
  // for deving
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      exitDueToFailure:
        "Terminates the whole process with a 'failure' code (1).", // $COMMENT#JSDOC#DEFINITIONS#EXITDUETOFAILURE
      escapeRegex:
        'Escapes all regex characters with a `"\\"` in a string to prepare it for use in a regex.', // $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX
      makeRuleResolve:
        "The utility that creates the resolve rule based on the flattened config data, used to transform $COMMENT#* placeholders into actual comments.", // $COMMENT#JSDOC#DEFINITIONS#MAKERULERESOLVE
      makeRuleCompress:
        "The utility that creates the compress rule based on the reversed flattened config data, used to transform actual comments into $COMMENT#* placeholders.", // $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS
      coreCommentsFlow:
        "The core flow at the heart of resolving and compressing comments.", // $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW
      resolveCommentsFlow:
        "The flow that resolves $COMMENT#* placeholders intro actual comments.", // $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW
      compressCommentsFlow:
        "The flow that compresses actual comments into $COMMENT#* placeholders.", // $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW
      findAllImports:
        "Finds all import paths recursively related to a given file path.", // $COMMENT#JSDOC#DEFINITIONS#FINDALLIMPORTS
      processImport:
        "Processes recursively and resolves a single import path. (Unlike `findAllImports`, here `currentDir`, `cwd`, `visitedSet`, `depth`, and `maxDepth` aren't options because they are mandatory and not pre-parameterized.)", // $COMMENT#JSDOC#DEFINITIONS#PROCESSIMPORT
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of $COMMENT-*-like keys and string values.", // $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA
      resolveConfig:
        "Verifies, validates and resolves the config path to retrieve the config's data and ignores.", // $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG
      logError:
        'Logs an error to the console depending on its type. (`"error"` or `"warning"`.)', // $COMMENT#JSDOC#DEFINITIONS#LOGERROR
    }),
    params: Object.freeze({
      string: "The string.", // $COMMENT#JSDOC#PARAMS#STRING
      flattenedConfigData:
        "The flattened config data, with $COMMENT#* placeholders as keys and actual comments as values.", // $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA
      reversedFlattenedConfigData:
        "The reversed flattened config data, with actual comments as keys and $COMMENT#* placeholders as values.", // $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
      ruleName:
        'The name of the rule currently used. (Either `"resolve"` or `"compress"`.)', // $COMMENT#JSDOC#PARAMS#RULENAME
      ignores:
        "The array of paths and globs for the flow's ESLint instance to ignore.", // $COMMENT#JSDOC#PARAMS#IGNORES
      eitherFlattenedConfigData:
        "Either the flattened config data or the reversed flattened config data, since they share the same structure.", // $COMMENT#JSDOC#PARAMS#EITHERFLATTENEDCONFIGDATA
      filePath:
        "The absolute path of the file whose imports are being recursively found, such as that of a project's `comments.config.js` file.", // $COMMENT#JSDOC#PARAMS#FILEPATH
      cwdOption:
        "The current working directory, set as `process.cwd()` by default.", // $COMMENT#JSDOC#PARAMS#CWDOPTION
      visitedSetOption:
        "The set of strings tracking the import paths that have already been visited, instantiated as a `new Set()` by default.", // $COMMENT#JSDOC#PARAMS#VISITEDSETOPTION
      depthOption:
        "The current depth of the recursion, instantiated at `0` by default.", // $COMMENT#JSDOC#PARAMS#DEPTHOPTION
      maxDepthOption:
        "The maximum depth allowed for the recursion, instantiated at `100` by default.", // $COMMENT#JSDOC#PARAMS#MAXDEPTHOPTION
      importPath: "The import path currently being addressed.", // $COMMENT#JSDOC#PARAMS#IMPORTPATH
      currentDirSetting:
        "The directory containing the import path currently being addressed.", // $COMMENT#JSDOC#PARAMS#CURRENTDIRSETTING
      cwdSetting: "The current working directory.", // $COMMENT#JSDOC#PARAMS#CWDSETTING
      visitedSetSetting:
        "The set of strings tracking the import paths that have already been visited.", // $COMMENT#JSDOC#PARAMS#VISITEDSETSETTING
      depthSetting: "The current depth of the recursion.", // $COMMENT#JSDOC#PARAMS#DEPTHSETTING
      maxDepthSetting: "The maximum depth allowed for the recursion.", // $COMMENT#JSDOC#PARAMS#MAXDEPTHSETTING
      configData:
        "The config's data property. (Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)", // $COMMENT#JSDOC#PARAMS#CONFIGDATA
      configDataMapOption:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.", // $COMMENT#JSDOC#PARAMS#CONFIGDATAMAPOPTION
      parentKeysOption:
        "The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings (`[]`).", // $COMMENT#JSDOC#PARAMS#PARENTKEYSOPTION
      configPath:
        'The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code Extension.', // $COMMENT#JSDOC#PARAMS#CONFIGPATH
      options: "The additional options as follows:", // $COMMENT#JSDOC#PARAMS#OPTIONS
      settings: "The required settings as follows:", // $COMMENT#JSDOC#PARAMS#SETTINGS
      error: "The error object being handle for the logging.", // $COMMENT#JSDOC#PARAMS#ERROR
    }),
    returns: Object.freeze({
      exitDueToFailure:
        "Never. (Somehow typing needs to be explicit for unreachable code inference.)", // $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE
      escapeRegex: `The string with regex characters escaped.`, // $COMMENT#JSDOC#RETURNS#ESCAPEREGEX
      makeRuleResolve: "The resolve rule based on the flattened config data.", // $COMMENT#JSDOC#RETURNS#MAKERULERESOLVE
      makeRuleCompress:
        "The compress rule based on the reversed flattened config data.", // $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS
      findAllImports:
        "The complete set of strings of import paths recursively related to the given file path in a success object (`success: true`). Errors are bubbled up during failures in a failure object (`success: false`).", // $COMMENT#JSDOC#RETURNS#FINDALLIMPORTS
      processImport:
        "The results of the embedded round of `findAllImports`, since `findAllImports`'s recursion happens within `processImport`.", // $COMMENT#JSDOC#RETURNS#PROCESSIMPORT
      flattenConfigData:
        "Both the flattened config data and its reversed version to ensure the strict reversibility of the `resolve` and `compress` commands in a success object (`success: true`). Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code Extension in a failure object (`success: false`).", // $COMMENT#JSDOC#RETURNS#FLATTENCONFIGDATA
      resolveConfig:
        "The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, and the original config. Errors are returned during failures so they can be reused differently on the CLI and the VS Code Extension.", // $COMMENT#JSDOC#RETURNS#RESOLVECONFIG
    }),
  }),
};

const ignores = ["README.md"];

const config = {
  data,
  ignores,
};

export default config;
