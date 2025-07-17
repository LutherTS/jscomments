const data = {
  // for testing
  levelOne: {
    levelTwo: {
      levelThree: "Level three.", // $COMMENT#LEVELONE#LEVELTWO#LEVELTHREE
      stillLevelThree: "LEVELONE#LEVELTWO#LEVELTHREE", // now is an alias // $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE
      otherLevelThree: "LEVELONE#LEVELTWO#LEVELTHREE", // also an alias // $COMMENT#LEVELONE#LEVELTWO#OTHERLEVELTHREE
      composedVariable:
        "$COMMENT#LEVELONE#LEVELTWO#LEVELTHREE $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE", // $COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLE // This is a composed variable. What's the beauty in this? It allows for each comment variable to be its own single source of truth that can be reused still within the Comment Variables ecosystem. All while preventing the use of comment variables placeholders as values in the config. AND as a matter of fact, it even works... with aliases. (Personal note: And that part is free and included in the CLI tool.)
      // wrongComposedVariable:
      //   "$COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLE $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE", // errors, can't make composed variables with composed variables
      // levelthree: "Also level three.", // errors, duplicate normalized key
      // alsoLevelThree: "Level three.", // errors, duplicate value
      // tooLevelThree: 2, // errors, value is invalid
      // $levelThree: "Dollar sign", // errors, key as "$" character
      // "#levelThree": "Hashtag", // errors, key as "#" character
      // ".levelThree": "Punctuation", // errors, key is invalid
      // unrecognized: `Unrecognized value.`, // errors, is not a string literal
      // emptyString: "", // errors, string is empty
      // "": "emptyKey", // errors, key is empty caught by the regex
    },
  },
  // for deving
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      exitDueToFailure:
        "Terminates the whole process with a 'failure' code (1).", // $COMMENT#JSDOC#DEFINITIONS#EXITDUETOFAILURE
      makeRuleResolve:
        "The utility that creates the resolve rule based on the flattened config data, used to transform $COMMENT placeholders into actual comments.", // $COMMENT#JSDOC#DEFINITIONS#MAKERULERESOLVE
      makeRuleCompress:
        "The utility that creates the compress rule based on the reversed flattened config data, used to transform actual comments into $COMMENT placeholders.", // $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS
      coreCommentsFlow:
        "The core flow at the heart of resolving and compressing comments.", // $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW
      resolveCommentsFlow:
        "The flow that resolves $COMMENT placeholders into actual comments.", // $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW
      compressCommentsFlow:
        "The flow that compresses actual comments into $COMMENT placeholders.", // $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW
      logError:
        'Logs an error to the console depending on its type. (`"error"` or `"warning"`.)', // $COMMENT#JSDOC#DEFINITIONS#LOGERROR
    }),
    params: Object.freeze({
      flattenedConfigData:
        "The flattened config data, with $COMMENT placeholders as keys and actual comments as values.", // $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA
      reversedFlattenedConfigData:
        "The reversed flattened config data, with actual comments as keys and $COMMENT placeholders as values.", // $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
      ruleName:
        'The name of the rule currently used. (Either `"resolve"` or `"compress"`.)', // $COMMENT#JSDOC#PARAMS#RULENAME
      ignores:
        "The array of paths and globs for the flow's ESLint instance to ignore.", // $COMMENT#JSDOC#PARAMS#IGNORES
      eitherFlattenedConfigData:
        "Either the flattened config data or the reversed flattened config data, since they share the same structure.", // $COMMENT#JSDOC#PARAMS#EITHERFLATTENEDCONFIGDATA
      error: "The error object being handle for the logging.", // $COMMENT#JSDOC#PARAMS#ERROR
      options: "The additional options as follows:", // $COMMENT#JSDOC#PARAMS#OPTIONS
      settings: "The required settings as follows:", // $COMMENT#JSDOC#PARAMS#SETTINGS
    }),
    returns: Object.freeze({
      exitDueToFailure:
        "Never. (Somehow typing needs to be explicit for unreachable code inference.)", // $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE
      makeRuleResolve: "The resolve rule based on the flattened config data.", // $COMMENT#JSDOC#RETURNS#MAKERULERESOLVE
      makeRuleCompress:
        "The compress rule based on the reversed flattened config data.", // $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS
    }),
  }),
};

const ignores = ["README.md"];

const config = {
  data,
  ignores,
};

export default config;
