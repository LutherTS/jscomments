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
  jsDoc: {
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
    }),
    returns: Object.freeze({
      exitDueToFailure: "Never.",
      escapeRegex: `The string with regex characters escaped.`,
      makeRuleResolve: "The resolve rule based on the flattened config data.",
      makeRuleCompress:
        "The compress rule based on the reversed flattened config data.",
    }),
  },
};

// export default config;

const trueConfig = {
  data: config,
  ignores: ["chocolat.js"],
};

export default trueConfig;
