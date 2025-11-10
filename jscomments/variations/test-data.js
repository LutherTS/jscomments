// export const enTestData = { hello: "Hello." };
// export const enTestData = { hello: "Hello.", goodbye: "Goodbye." }; // goodbye is missing (with OG frTestData)
export const enTestData = Object.freeze({
  hello: "Hello." /* variations: $COMMENT#HELLO / core: $COMMENT#EN#HELLO */,
  goodbye:
    "Goodbye." /* variations: $COMMENT#GOODBYE / core: $COMMENT#EN#GOODBYE */,
  helloAlias:
    "EN#HELLO" /* variations: $COMMENT#HELLOALIAS / core: $COMMENT#EN#HELLOALIAS */,
  forComposed1:
    "Hello" /* variations: $COMMENT#FORCOMPOSED1 / core: $COMMENT#EN#FORCOMPOSED1 */,
  forComposed2:
    "goodbye." /* variations: $COMMENT#FORCOMPOSED2 / core: $COMMENT#EN#FORCOMPOSED2 */,
  composed:
    "$COMMENT#EN#FORCOMPOSED1 $COMMENT#EN#FORCOMPOSED2" /* variations: $COMMENT#COMPOSED / core: $COMMENT#EN#COMPOSED */,
  composedWithAlias:
    "$COMMENT#EN#FORCOMPOSED1 $COMMENT#EN#FORCOMPOSED2 $COMMENT#EN#HELLOALIAS" /* variations: $COMMENT#COMPOSEDWITHALIAS / core: $COMMENT#EN#COMPOSEDWITHALIAS */,
  _testFunction:
    "A test function, with its JSDoc appropriately shifting between English and French." /* variations: $COMMENT#_TESTFUNCTION / core: $COMMENT#EN#_TESTFUNCTION */,
  // fr: "something", // now errors, can't have a variant as top-level key of a variation
});

// export const frTestData = { hello: "Bonjour." };
// export const frTestData = { hello: "Bonjour.", goodbye: "Au revoir." }; // goodbye is outstanding (with OG enTestData)
// export const frTestData = {}; // variations are allowed to be empty, at the very least they should begin by being represented by an empty object, to be completed step-by-step with error handling by turning errorOnMissingVariationKey true
export const frTestData = Object.freeze({
  hello: "Bonjour." /* variations: $COMMENT#HELLO / core: $COMMENT#FR#HELLO */,
  goodbye:
    "Au revoir." /* variations: $COMMENT#GOODBYE / core: $COMMENT#FR#GOODBYE */,
  helloAlias:
    "FR#HELLO" /* variations: $COMMENT#HELLOALIAS / core: $COMMENT#FR#HELLOALIAS */,
  forComposed1:
    "Bonjour" /* variations: $COMMENT#FORCOMPOSED1 / core: $COMMENT#FR#FORCOMPOSED1 */,
  forComposed2:
    "au revoir." /* variations: $COMMENT#FORCOMPOSED2 / core: $COMMENT#FR#FORCOMPOSED2 */,
  forComposed3:
    "au revoir ?" /* variations: $COMMENT#FORCOMPOSED3 / core: $COMMENT#FR#FORCOMPOSED3 */,
  composed:
    "$COMMENT#FR#FORCOMPOSED1 $COMMENT#FR#FORCOMPOSED2" /* variations: $COMMENT#COMPOSED / core: $COMMENT#FR#COMPOSED */,
  composedWithAlias:
    "$COMMENT#FR#FORCOMPOSED1 $COMMENT#FR#FORCOMPOSED2 $COMMENT#FR#HELLOALIAS" /* variations: $COMMENT#COMPOSEDWITHALIAS / core: $COMMENT#FR#COMPOSEDWITHALIAS */,
  _testFunction:
    "Une fonction de test, avec sa JSDoc basculant du français à l'anglais sur demande." /* variations: $COMMENT#_TESTFUNCTION / core: $COMMENT#FR#_TESTFUNCTION */,
  // fr: "quelque chose", // now errors, can't have a variant as top-level key of a variation
});
