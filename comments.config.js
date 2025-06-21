const config = {
  // for testing
  levelOne: {
    levelTwo: {
      levelThree: "Level three.",
      // levelthree: "Also level three.", // errors
      // alsoLevelThree: "Level three.", // errors
      levelThreeBis: "Level three bis.",
      levelThreeTer: "Level three ter.",
      levelThreeAlso: "Also level three here.",
      levelThreeToo: "This too is level three.",
      // test: "LEVELONE#LEVELTWO#LEVELTHREE", // errors
      // [`level$Three#First
      //   whitespace`]: `This is level three
      // with whitespaces. `, // fails
      // testing: 2, // fails
      // ".'e": "",
    },
  },
  // for deving
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      exitDueToFailure:
        "Terminates the whole process with a 'failure' code (1).",
      escapeRegex: `Escapes all regex characters with a \`"\\"\` in a string to prepare it for use in a regex.`,
      makeRuleResolve:
        "The utility that creates the resolve rule based on the flattened config data, used to transform $COMMENT#* placeholders into actual comments.",
      makeRuleCompress:
        "The utility that creates the compress rule based on the reversed flattened config data, used to transform actual comments into $COMMENT#* placeholders.",
      coreCommentsFlow:
        "The core flow at the heart of resolving and compressing comments.",
      resolveCommentsFlow:
        "The flow that resolves $COMMENT#* placeholders intro actual comments.",
      compressCommentsFlow:
        "The flow that compresses actual comments into $COMMENT#* placeholders.",
      findAllImports:
        "Finds all import paths recursively related to a given file path.",
      processImport: "Processes recursively and resolves a single import path.",
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of $COMMENT-*-like keys and string values.",
    }),
    params: Object.freeze({
      string: "The string.",
      flattenedConfigData:
        "The flattened config data, with $COMMENT#* placeholders as keys and actual comments as values.",
      reversedFlattenedConfigData:
        "The reversed flattened config data, with actual comments as keys and $COMMENT#* placeholders as values.",
      ruleName:
        'The name of the rule currently used. (Either `"resolve"` or `"compress"`.)',
      ignores:
        "The array of paths and globs for the flow's ESLint instance to ignore.",
      eitherFlattenedConfigData:
        "Either the flattened config data or the reversed flattened config data, since they share the same structure.",
      filePath:
        "The absolute path of the file whose imports are being recursively found, such as that of a project's `comments.config.js` file.",
      cwd: "The current working directory, set as `process.cwd()` by default.",
      visitedSet:
        "The set of strings tracking the import paths that have already been visited, instantiated as a `new Set()` by default.",
      depth:
        "The current depth of the recursion, instantiated at `0` by default.",
      maxDepth:
        "The maximum depth allowed for the recursion, instantiated at `100` by default.",
      importPath: "The import path currently being addressed.",
      currentDir:
        "The directory containing the import path currently being addressed.",
      configData:
        "The config's data property. (Values are typed `any` given the limitations in typing recursive values in JSDoc.)",
      configDataMap:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.",
      parentKeys:
        "The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings.",
    }),
    returns: Object.freeze({
      exitDueToFailure:
        "Never. (Somehow typing needs to be explicit for unreachable code inference.)",
      escapeRegex: `The string with regex characters escaped.`,
      makeRuleResolve: "The resolve rule based on the flattened config data.",
      makeRuleCompress:
        "The compress rule based on the reversed flattened config data.",
      findAllImports:
        "The complete set of strings of import paths recursively related to the given file path, or `null` if an issue has arisen.",
      processImport:
        "`true` to skip unresolved paths, `false` if resolution fails at any level.",
      flattenConfigData:
        "Both the flattened config data and its reversed version to ensure the strict reversibility of the `resolve` and `compress` commands.",
    }),
  }),
};

// export default config;

const trueConfig = {
  data: config,
  ignores: ["chocolat.js"],
};

export default trueConfig;
