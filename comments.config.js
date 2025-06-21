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
      processImport: "Processes recursively and resolves a single import path.", // $COMMENT#JSDOC#DEFINITIONS#PROCESSIMPORT
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of $COMMENT-*-like keys and string values.", // $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA
      resolveConfig:
        "Verifies, validates and resolves the config path to retrieve the config's data and ignores.", // $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG
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
      cwd: "The current working directory, set as `process.cwd()` by default.", // $COMMENT#JSDOC#PARAMS#CWD
      visitedSet:
        "The set of strings tracking the import paths that have already been visited, instantiated as a `new Set()` by default.", // $COMMENT#JSDOC#PARAMS#VISITEDSET
      depth:
        "The current depth of the recursion, instantiated at `0` by default.", // $COMMENT#JSDOC#PARAMS#DEPTH
      maxDepth:
        "The maximum depth allowed for the recursion, instantiated at `100` by default.", // $COMMENT#JSDOC#PARAMS#MAXDEPTH
      importPath: "The import path currently being addressed.", // $COMMENT#JSDOC#PARAMS#IMPORTPATH
      currentDir:
        "The directory containing the import path currently being addressed.", // $COMMENT#JSDOC#PARAMS#CURRENTDIR
      configData:
        "The config's data property. (Values are typed `any` given the limitations in typing recursive values in JSDoc.)", // $COMMENT#JSDOC#PARAMS#CONFIGDATA
      configDataMap:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.", // $COMMENT#JSDOC#PARAMS#CONFIGDATAMAP
      parentKeys:
        "The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings.", // $COMMENT#JSDOC#PARAMS#PARENTKEYS
      configPath:
        "The path of the config, either from `comments.config.js` or from a config passed via the `--config` flag.", // $COMMENT#JSDOC#PARAMS#CONFIGPATH
    }),
    returns: Object.freeze({
      exitDueToFailure:
        "Never. (Somehow typing needs to be explicit for unreachable code inference.)", // $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE
      escapeRegex: `The string with regex characters escaped.`, // $COMMENT#JSDOC#RETURNS#ESCAPEREGEX
      makeRuleResolve: "The resolve rule based on the flattened config data.", // $COMMENT#JSDOC#RETURNS#MAKERULERESOLVE
      makeRuleCompress:
        "The compress rule based on the reversed flattened config data.", // $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS
      findAllImports:
        "The complete set of strings of import paths recursively related to the given file path, or `null` if an issue has arisen.", // $COMMENT#JSDOC#RETURNS#FINDALLIMPORTS
      processImport:
        "`true` to skip unresolved paths, `false` if resolution fails at any level.", // $COMMENT#JSDOC#RETURNS#PROCESSIMPORT
      flattenConfigData:
        "Both the flattened config data and its reversed version to ensure the strict reversibility of the `resolve` and `compress` commands.", // $COMMENT#JSDOC#RETURNS#FLATTENCONFIGDATA
      resolveConfig:
        "The flattened config data, the reverse flattened config data, the verified config path and the raw passed ignores.", // $COMMENT#JSDOC#RETURNS#RESOLVECONFIG
    }),
  }),
};

const ignores = ["README.md"];

const config = {
  data,
  ignores,
};

export default config;
