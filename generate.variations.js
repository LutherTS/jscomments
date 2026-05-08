// The Comment Variables config template generated in case no config file has been found.

/* variants */

const EN = "en";
const ENGLISH = "English";

const FR = "fr";
const FRANÇAIS = "français";

/* data */

const enData = Object.freeze({
  comment: "This is a comment.",
  alias: "EN#COMMENT",
  composed: "$COMMENT#EN#COMMENT $COMMENT#EN#COMMENTS#YES. $COMMENT#EN#ALIAS",
  comments: Object.freeze({
    yes: "Yes",
    no: "No.",
  }),
});

const frData = Object.freeze({
  comment: "Ceci est un commentaire.",
  alias: "FR#COMMENT",
  composed: "$COMMENT#FR#COMMENT $COMMENT#FR#COMMENTS#YES. $COMMENT#FR#ALIAS",
  comments: Object.freeze({
    yes: "Oui",
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
]; // composed variables allowed, Comment Variables that include `#COMPOSEDVARIABLESEXCLUSIVES#` are implicitly added

/* variations */

const variations = Object.freeze({
  // Defines all variants that have matching variations duly defined within the top-level keys of `data`.
  variants: Object.freeze({
    [EN]: Object.freeze({ label: ENGLISH }),
    [FR]: Object.freeze({ label: FRANÇAIS }),
  }),
  // Defines the current variant that Comment Variables currently resolves to.
  variant: FR,
  // Defines the reference variation that all other variations need to have (or aim to have) matching keys with. Requires a JavaScript variable as it needs to be the exact same object as the one referenced at `data[variations.referenceVariant]`.
  referenceData: enData,
  // Defines the variant of the reference variation.
  referenceVariant: EN,
  // Defines the behavior of the error handling in case of variations that do not match one-to-one with the reference variation. If `true`, allows incomplete variations data to remain. If `false`, errors and guides the fixing of missing variations data (while ignoring composed variables exclusives).
  allowIncompleteVariations: true,
  // Defines which variants' `#PUBLIC#` Comment Variables should be publicly available, by default through `comments.public.mjs` and `comments.public.json`.
  // public: [EN, FR] // v3
});

// /* libraries */

// import { commentVariablesData as libraryCommentVariablesData } from "library"

// const libraries = {
//   "library": libraryCommentVariablesData.variantKey
// } // v3

const config = {
  data,
  ignores,
  lintConfigImports,
  myIgnoresOnly,
  composedVariablesExclusives,
  variations,
  // libraries // v3
};

export default config;

// Just flip the `variations` object's `variant` key back and forth between `EN` and `FR` and see what happens when running commands and hovering on the accompanying `comments.example.js` file that has also been generated.

// The `comment-variables resolve` command resolves Comment Variables into comments.
// The `comment-variables compress` command compresses comments into Comment Variables.
// And the `comment-variables placeholders` command generates Comment Variables placeholders right next to where their values are defined.

// For hover resolutions, you'll need the dedicated VS Code extension for Comment Variables.

// Once you've grasped these concepts, simply rename this file, its JSON counterpart and its `.mjs` counterpart to `comments.config.js`, `comments.config.json` and `comments.config.mjs` respectively and you're good to go. (If you're using the extension, make sure to run VS Code's "Developer: Reload Window" command for the extension to operate based on your new `comments.config.js` file.)
