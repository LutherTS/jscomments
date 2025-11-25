// A Comment Variables config template generated in case no config file has been found. Feel free to use it as a stepping stone to learn how to use Comment Variables.

// As a first step, go ahead and run the command `comment-variables placeholders`. (This generates the Comment Variables placeholders right next to where their values are defined.)
// Then rename the `$COMMENT#COMMENT` placeholder next to the `alias` key's value in the `data` object to `$COMMENT#ALIAS`, and run again `comment-variables placeholders` to see what happens. (...Which is nothing, and I let you figure out why.)

// You can now use and explore Comment Variables on the accompanying `comments.example.js` file that has also been generated.

const data = Object.freeze({
  comment: "This is a comment.",
  alias: "COMMENT",
  composed: "$COMMENT#COMMENT $COMMENT#COMMENTS#YES $COMMENT#ALIAS",
  comments: Object.freeze({
    yes: "Yes.",
    no: "No.",
  }),
});

const ignores = [];

const lintConfigImports = false; // can be omitted
const myIgnoresOnly = false; // can be omitted

const composedVariablesExclusives = []; // can be omitted

const variations = undefined; // can be omitted

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
