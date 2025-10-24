// const obj = { test: "Testing." }; // errors, object string values in config files are reserved for exports from the config.

const data = {
  // for testing
  levelOne: {
    levelTwo: {
      levelThree: "Level three." /* $COMMENT#LEVELONE#LEVELTWO#LEVELTHREE */, // New placeholder structure. Not as sexy, but first and foremost guaranteed to be functional appended right at the end of the value as a Block comment, and last but not least also guaranteed to not modify Value Locations in the process. So `comment-variables placeholders` it is, and this justifies enforcing strings only for values even outside of the use of the VS Code extension.
      // levelThreeEscape:
      //   "Level three. \
      //       fdff\
      // " /* $COMMENT#LEVELONE#LEVELTWO#LEVELTHREEESCAPE */, // NOW ERRORS AS INTENDED, unrecognizedValuesSet
      stillLevelThree:
        "LEVELONE#LEVELTWO#LEVELTHREE" /* $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE */, // now is an alias
      otherLevelThree:
        "LEVELONE#LEVELTWO#LEVELTHREE" /* $COMMENT#LEVELONE#LEVELTWO#OTHERLEVELTHREE */, // also an alias
      composedVariable:
        "$COMMENT#LEVELONE#LEVELTWO#LEVELTHREE $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE" /* $COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLE */, // This is a composed variable. What's the beauty in this? It allows for each comment variable to be its own single source of truth that can be reused still within the Comment Variables ecosystem. All while preventing the use of Comment Variables placeholders as values in the config. AND as a matter of fact, it even works... with aliases.
      composedVariableAlias:
        "LEVELONE#LEVELTWO#COMPOSEDVARIABLE" /* $COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLEALIAS */, // The alias of a composed variable. SO just like composed variables can incorporate aliases, aliases can be aliases for composed variables.

      // otherLevelThreeAlias:
      //   "LEVELONE#LEVELTWO#OTHERLEVELTHREE" /* $COMMENT#LEVELONE#LEVELTWO#LEVELTHREE */, // errors, can't be the alias of another alias

      // composedOfAlias:
      //   "$COMMENT#LEVELONE#LEVELTWO#LEVELTHREE $COMMENT#LEVELONE#LEVELTWO#ALIASOFCOMPOSED" /* $COMMENT#LEVELONE#LEVELTWO#COMPOSEDOFALIAS */, // 1/2 already errored // ERROR. A potential composed variable cannot be used as the comment variable of another composed variable.
      // aliasOfComposed:
      //   "LEVELONE#LEVELTWO#COMPOSEDOFALIAS" /* $COMMENT#LEVELONE#LEVELTWO#ALIASOFCOMPOSED */, // 2/2 What if an alias variable was a segment to a composed variable made of itself? // ERROR. The alias "LEVELONE#LEVELTWO#ALIASOFCOMPOSED" links to composed variable "$COMMENT#LEVELONE#LEVELTWO#LEVELTHREE $COMMENT#LEVELONE#LEVELTWO#ALIASOFCOMPOSED" that includes LEVELONE#LEVELTWO#ALIASOFCOMPOSED's placeholder as a segment.

      // aliasInComposed:
      //   "$COMMENT#LEVELONE#LEVELTWO#LEVELTHREE $COMMENT#LEVELONE#LEVELTWO#ALIASINCOMPOSED", // What if a composed variable had its own value has one of its segments? Composed variables already cannot compose other composed variables. // errors, "ERROR. A potential composed variable cannot be used as the comment variable of another composed variable."
      // wrongComposedVariable:
      //   "$COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLE $COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE", // errors, can't make composed variables with composed variables
      // wrongComposedVariableToo:
      //   "$COMMENT#LEVELONE#LEVELTWO#STILLLEVELTHREE $COMMENT#LEVELONE#LEVELTWO#COMPOSEDVARIABLE", // errors, can't make composed variables with composed variables even as aliases
      // levelthree: "Also level three.", // errors, duplicate normalized key
      // levelThree: "Also level three.", // errors, duplicate key with original overriden by legal JavaScript object value overrides
      // alsoLevelThree: "Level three.", // errors, duplicate value
      // tooLevelThree: 2, // errors, value is invalid
      // $levelThree: "Dollar sign", // errors, key as "$" character
      // "#levelThree": "Hashtag", // errors, key as "#" character
      // ".levelThree": "Punctuation", // errors, key is invalid due to punctuation
      // unrecognized: `Unrecognized value.`, // errors, is not a string literal
      // emptyString: "", // errors, string is empty
      // "": "emptyKey", // errors, key is empty caught by the regex
      // ownAliasKey: "LEVELONE#LEVELTWO#OWNALIASKEY", // errors, is its own key/alias
      // key: "key not allowed", // errors, "key", "value" and "placeholder" not allowed
      // value: "value not allowed", // errors, "key", "value" and "placeholder" not allowed
      // placeholder: "placeholder not allowed", // errors, "key", "value" and "placeholder" not allowed
      // noConcat: "no" + "concat", // errors, unrecognized value

      // already error via regex, but now enhanced:
      // "//": "key comment error 1",
      // "/*": "key comment error 2",
      // "*/": "key comment error 3",
      // error directly in resolveConfig:
      // "key comment error 1": "//",
      // "key comment error 2": "/*",
      // "key comment error 3": "*/",
    },
  },
  // for deving
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      exitDueToFailure:
        "Terminates the whole process with a 'failure' code (`1`)." /* $COMMENT#JSDOC#DEFINITIONS#EXITDUETOFAILURE */,
      makeRuleResolve:
        "The utility that creates the resolve rule based on the flattened config data, used to transform `$COMMENT` placeholders into actual comments." /* $COMMENT#JSDOC#DEFINITIONS#MAKERULERESOLVE */,
      makeRuleCompress:
        "The utility that creates the compress rule based on the reversed flattened config data, used to transform actual comments into `$COMMENT` placeholders." /* $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS */,
      coreCommentsFlow:
        "The core flow at the heart of resolving and compressing comments." /* $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW */,
      resolveCommentsFlow:
        "The flow that resolves `$COMMENT` placeholders into actual comments." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW */,
      compressCommentsFlow:
        "The flow that compresses actual comments into `$COMMENT` placeholders." /* $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW */,
      placeholdersCommentsFlow:
        "The flow that creates `$COMMENT` placeholders right next to where they're defined." /* $COMMENT#JSDOC#DEFINITIONS#PLACEHOLDERSCOMMENTSFLOW */,
      logError:
        'Logs an error to the console depending on its type. (`"error"` or `"warning"`.)' /* $COMMENT#JSDOC#DEFINITIONS#LOGERROR */,
    }),
    params: Object.freeze({
      flattenedConfigData:
        "The flattened config data, with `$COMMENT` placeholders as keys and actual comments as values." /* $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA */,
      reversedFlattenedConfigData:
        "The reversed flattened config data, with actual comments as keys and `$COMMENT` placeholders as values." /* $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA */,
      composedVariablesExclusives:
        "The array of comment variables keys (implying their aliases as well) exclusively used to craft composed variables, that should be ignored by both the `resolve` and the `compress` commands." /* $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVES */,
      aliases_flattenedKeys:
        "The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias." /* $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS */,
      ruleName:
        'The name of the rule currently used. (Either `"resolve"` or `"compress"`.)' /* $COMMENT#JSDOC#PARAMS#RULENAME */,
      ignores:
        "The array of paths and globs for the flow's ESLint instance to ignore." /* $COMMENT#JSDOC#PARAMS#IGNORES */,
      eitherFlattenedConfigData:
        "Either the flattened config data or the reversed flattened config data, since they share the same structure." /* $COMMENT#JSDOC#PARAMS#EITHERFLATTENEDCONFIGDATA */,
      error:
        "The error object being handle for the logging." /* $COMMENT#JSDOC#PARAMS#ERROR */,
      options:
        "The additional options as follows:" /* $COMMENT#JSDOC#PARAMS#OPTIONS */,
      settings:
        "The required settings as follows:" /* $COMMENT#JSDOC#PARAMS#SETTINGS */,
      configPathIgnores:
        'The array of paths linked to the config file, (named "ignores" given it is ignored by the "compress" and "resolve" commands).' /* $COMMENT#JSDOC#PARAMS#CONFIGPATHIGNORES */,
      originalFlattenedConfigData:
        "The original flattened config data, before changes to aliases variables and composed variables are applied." /* $COMMENT#JSDOC#PARAMS#ORIGINALFLATTENEDCONFIGDATA */,
      relativeMjsPath:
        'The relative path of the generated `.mjs` file to be ignored in the "placeholders" process.' /* $COMMENT#JSDOC#PARAMS#RELATIVEMJSPATH */,
    }),
    returns: Object.freeze({
      exitDueToFailure:
        "Never. (Somehow typing needs to be explicit for unreachable code inference.)" /* $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE */,
      makeRuleResolve:
        "The resolve rule based on the flattened config data." /* $COMMENT#JSDOC#RETURNS#MAKERULERESOLVE */,
      makeRuleCompress:
        "The compress rule based on the reversed flattened config data." /* $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS */,
    }),
    constants: Object.freeze({
      sortedReversedFlattenedConfigData:
        "The whole `reversedFlattenedConfigData` turned from an object to an array of key-value arrays sorted by the descending length of each key to prevent partial replacements." /* $COMMENT#JSDOC#CONSTANTS#SORTEDREVERSEDFLATTENEDCONFIGDATA */,
      composedVariablesExclusivesSet:
        "A local Set out of composed variables exclusives for speed." /* $COMMENT#JSDOC#CONSTANTS#COMPOSEDVARIABLESEXCLUSIVESSET */,
    }),
  }),
};

const ignores = ["README.md", "generate.template.js", "generate.example.js"];

const lintConfigImports = false; // can be omitted
const myIgnoresOnly = false; // can be omitted

const composedVariablesExclusives = []; // can be omitted

const config = {
  data,
  ignores,
  lintConfigImports,
  myIgnoresOnly,
  composedVariablesExclusives,
};

export default config;
