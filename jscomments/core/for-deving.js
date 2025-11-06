export const forDeving = {
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
      variations:
        "A boolean that determines the format of the generated placeholders according to whether or not the config is enabling variations." /* $COMMENT#JSDOC#PARAMS#VARIATIONS */,
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
