const data = {
  // for testing
  levelOne: {
    levelTwo: {
      levelThree: "Level three." /* $COMMENT#LEVELONE#LEVELTWO#LEVELTHREE */, // New placeholder structure. Not as sexy, but first and foremost guaranteed to be functional appended right at the end of the value as a Block comment, and last but not least also guaranteed to not modify Value Locations in the process. So `comment variables placeholders` it is, and this justifies enforcing strings only for values even outside of the use of the VS Code extension.
      levelThreeEscape:
        "Level three. \
      fdff\
" /* $COMMENT#LEVELONE#LEVELTWO#LEVELTHREEESCAPE */, // valid
      stillLevelThree:
        "LEVELONE#LEVELTWO#LEVELTHREE" /* $COMMENT#LEVELONE#LEVELTWO#OTHERLEVELTHREE */ /* $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE */, // now is an alias
      otherLevelThree:
        "LEVELONE#LEVELTWO#LEVELTHREE" /* $COMMENT#LEVELONE#LEVELTWO#OTHERLEVELTHREE */, // also an alias
      composedVariable:
        "$COMMENT#LEVELONE#LEVELTWO#LEVELTHREE $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE" /* $COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLE */, // This is a composed variable. What's the beauty in this? It allows for each comment variable to be its own single source of truth that can be reused still within the Comment Variables ecosystem. All while preventing the use of comment variables placeholders as values in the config. AND as a matter of fact, it even works... with aliases. (Personal note: And that part is free and included in the CLI tool.)
      // wrongComposedVariable:
      //   "$COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLE $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE", // errors, can't make composed variables with composed variables
      composedVariableAlias:
        "LEVELONE#LEVELTWO#COMPOSEDVARIABLE" /* $COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLEALIAS */,
      // wrongComposedVariableToo:
      //   "$COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE $COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLE", // errors, can't make composed variables with composed variables even as aliases

      // levelthree: "Also level three.", // errors, duplicate normalized key
      // levelThree: "Also level three.", // errors, duplicate key with original overriden by legal JavaScript object value overrides
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
        "Terminates the whole process with a 'failure' code (1)." /* $COMMENT#JSDOC#DEFINITIONS#EXITDUETOFAILURE */, // $COMMENT#JSDOC#DEFINITIONS#EXITDUETOFAILURE
      makeRuleResolve:
        "The utility that creates the resolve rule based on the flattened config data, used to transform `$COMMENT` placeholders into actual comments." /* $COMMENT#JSDOC#DEFINITIONS#MAKERULERESOLVE */, // $COMMENT#JSDOC#DEFINITIONS#MAKERULERESOLVE
      makeRuleCompress:
        "The utility that creates the compress rule based on the reversed flattened config data, used to transform actual comments into `$COMMENT` placeholders." /* $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS */, // $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS
      coreCommentsFlow:
        "The core flow at the heart of resolving and compressing comments." /* $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW */, // $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW
      resolveCommentsFlow:
        "The flow that resolves `$COMMENT` placeholders into actual comments." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW */, // $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW
      compressCommentsFlow:
        "The flow that compresses actual comments into `$COMMENT` placeholders." /* $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW */, // $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW
      logError:
        'Logs an error to the console depending on its type. (`"error"` or `"warning"`.)' /* $COMMENT#JSDOC#DEFINITIONS#LOGERROR */, // $COMMENT#JSDOC#DEFINITIONS#LOGERROR
    }),
    params: Object.freeze({
      flattenedConfigData:
        "The flattened config data, with `$COMMENT` placeholders as keys and actual comments as values." /* $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA */, // $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA
      reversedFlattenedConfigData:
        "The reversed flattened config data, with actual comments as keys and `$COMMENT` placeholders as values." /* $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA */, // $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
      aliases_flattenedKeys:
        "The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias." /* $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS */, // $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
      ruleName:
        'The name of the rule currently used. (Either `"resolve"` or `"compress"`.)' /* $COMMENT#JSDOC#PARAMS#RULENAME */, // $COMMENT#JSDOC#PARAMS#RULENAME
      ignores:
        "The array of paths and globs for the flow's ESLint instance to ignore." /* $COMMENT#JSDOC#PARAMS#IGNORES */, // $COMMENT#JSDOC#PARAMS#IGNORES
      eitherFlattenedConfigData:
        "Either the flattened config data or the reversed flattened config data, since they share the same structure." /* $COMMENT#JSDOC#PARAMS#EITHERFLATTENEDCONFIGDATA */, // $COMMENT#JSDOC#PARAMS#EITHERFLATTENEDCONFIGDATA
      error:
        "The error object being handle for the logging." /* $COMMENT#JSDOC#PARAMS#ERROR */, // $COMMENT#JSDOC#PARAMS#ERROR
      options:
        "The additional options as follows:" /* $COMMENT#JSDOC#PARAMS#OPTIONS */, // $COMMENT#JSDOC#PARAMS#OPTIONS
      settings:
        "The required settings as follows:" /* $COMMENT#JSDOC#PARAMS#SETTINGS */, // $COMMENT#JSDOC#PARAMS#SETTINGS
    }),
    returns: Object.freeze({
      exitDueToFailure:
        "Never. (Somehow typing needs to be explicit for unreachable code inference.)" /* $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE */, // $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE
      makeRuleResolve:
        "The resolve rule based on the flattened config data." /* $COMMENT#JSDOC#RETURNS#MAKERULERESOLVE */, // $COMMENT#JSDOC#RETURNS#MAKERULERESOLVE
      makeRuleCompress:
        "The compress rule based on the reversed flattened config data." /* $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS */, // $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS
    }),
  }),
};

const ignores = ["README.md"];

const config = {
  data,
  ignores,
};

export default config;
