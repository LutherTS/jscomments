// A Comment Variables config template generated in case no config file has been found. Feel free to use it as a stepping stone to learn how to use Comment Variables.

// As a first step, go ahead and run the command `comment-variables placeholders`.
// Then rename the `$COMMENT#COMMENT` placeholder next to `alias` to `$COMMENT#ALIAS` and run `comment-variables placeholders` to see what happens.
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

const lintConfigImports = false; // can be ommitted
const myIgnoresOnly = false; // can be ommitted

const config = {
  data,
  ignores,
  lintConfigImports,
  myIgnoresOnly,
};

export default config;

// Once you've grasped these concepts, run the command `comment-variables start` to rename this file and the JSON to `comments.config.js` and `comments.config.json` respectively and you're good to go.
