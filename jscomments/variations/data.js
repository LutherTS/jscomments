import { EN, FR, ENGLISH, FRANÇAIS } from "./constants.js";
import { enTestData, frTestData } from "./test-data.js";

export const variationsData = Object.freeze({
  [EN]: Object.freeze(enTestData),
  [FR]: Object.freeze(frTestData),
});

export const composedVariablesExclusives = ["FR#FORCOMPOSED3"]; // can be omitted

// const HELLO = "Hello.";

export const variations = {
  variants: {
    [EN]: { label: ENGLISH }, // `English`
    [FR]: { label: FRANÇAIS }, // `français`
  },
  variant: FR,

  referenceData: enTestData,
  // referenceData: { hello: HELLO }, // correctly errors (reference only) (with OG enTestData)
  // referenceData: { ...enTestData }, // correctly errors (reference only) (with OG enTestData)
  // also
  referenceVariant: EN,
};
