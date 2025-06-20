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
    definitions: {
      exitDueToFailure:
        "Terminates the whole process with a 'failure' code (1).",
      escapeRegex: `Escapes all regex characters with a \`"\\"\` in a string to prepare it for use in a regex.`,
      makeRuleResolve:
        "The utility that creates the resolve rule based on the flattened config, used to transform $COMMENT#* placeholders into actual comments.",
      makeRuleCompress:
        "The utility that creates the compress rule based on the reversed flattened config, used to transform actual comments into $COMMENT#* placeholders.",
    },
    params: {
      string: "The string.",
      flattenedConfig:
        "The flattened config, with $COMMENT#* placeholders as keys and actual comments as values.",
      reversedFlattenedConfig:
        "The reversed flattened config, with and actual comments as keys and $COMMENT#* placeholders as values.",
    },
    returns: {
      exitDueToFailure: "Never.",
      escapeRegex: `The string with regex characters escaped.`,
      makeRuleResolve: "The resolve rule based on the flattened config.",
      makeRuleCompress:
        "The compress rule based on the reversed flattened config.",
    },
  },
};

// export default config;

const trueConfig = {
  data: config,
  ignores: ["chocolat.js"],
};

export default trueConfig;
