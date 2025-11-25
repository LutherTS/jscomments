// The Comment Variables config template generated in case no config file has been found.

// Just flip the `variations` object's `variant` key back and forth between `EN` and `FR` and see what happens on the accompanying `comments.example.js` file that has also been generated.

/* variants */

const EN = "en";
const ENGLISH = "English";
const FR = "fr";
const FRANÇAIS = "français";

/* data */

const enData = Object.freeze({
  comment: "This is a comment.",
  alias: "EN#COMMENT",
  composed: "$COMMENT#EN#COMMENT $COMMENT#EN#COMMENTS#YES $COMMENT#EN#ALIAS",
  comments: Object.freeze({
    yes: "Yes.",
    no: "No.",
  }),
});

const frData = Object.freeze({
  comment: "Ceci est un commentaire.",
  alias: "FR#COMMENT",
  composed: "$COMMENT#FR#COMMENT $COMMENT#FR#COMMENTS#YES $COMMENT#FR#ALIAS",
  comments: Object.freeze({
    yes: "Oui.",
    no: "Non.",
  }),
});

const data = Object.freeze({
  [EN]: enData,
  [FR]: frData,
});

/* ignores */

const ignores = [];

/* lintConfigImports */

const lintConfigImports = false; // can be omitted

/* myIgnoresOnly */

const myIgnoresOnly = false; // can be omitted

/* composedVariablesExclusives */

const enComposedVariablesExclusives = ["EN#COMMENTS#YES"];

const frComposedVariablesExclusives = ["FR#COMMENTS#YES"];

const composedVariablesExclusives = [
  ...enComposedVariablesExclusives,
  ...frComposedVariablesExclusives,
]; // can be omitted

/* variations */

const variations = {
  // defines all variants that have matching variations duly defined within the top-level keys of `data`
  variants: {
    [EN]: { label: ENGLISH },
    [FR]: { label: FRANÇAIS },
  },
  // defines the current variant that Comment Variables currently resolves to
  variant: FR,
  // Defines the reference variation that all other variations need to have (or aim to have) matching keys with. Requires a JavaScript variable as it needs to be the exact same object as the one referenced at `data[variations.referenceVariant]`.
  referenceData: enData,
  // defines the variant of the reference variation
  referenceVariant: EN,
  // Defines the behavior of the error handling in case of variations that do not match one-to-one with the reference variation. If `true`, allows incomplete variations data to remain. If `false`, errors and guides the fixing of missing variations data.
  allowIncompleteVariations: true,
}; // can be omitted

const config = {
  data,
  ignores,
  lintConfigImports,
  myIgnoresOnly,
  composedVariablesExclusives,
  variations,
};

export default config;

// Once you've grasped these concepts, simply rename this file, its JSON counterpart and its `.mjs` counterpart to `comments.config.js`, `comments.config.json` and `comments.config.mjs` respectively and you're good to go. (If you're using the extension, make sure to run VS Code's "Developer: Reload Window" command for the extension to operate based on your new `comments.config.js` file.)

// When it comes to the VS Code extension, variations are only compatible with versions 2 and above.
