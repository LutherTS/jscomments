export const forTesting = {
  // for testing (I didn't do the full freeze on this one.)
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
      // noConcat: "no" + "concat", // errors, unrecognized value
      placeholder: "placeholder now allowed", // doesn't error, "placeholder" is now allowed

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
};
