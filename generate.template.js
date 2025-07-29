// A Comment Variables config template generated upon approval in case no config file has been found. Feel free to use it as a steping stone to learn how to use Comment Variables.

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

// Once you've grasped these concepts, simply copy or rename this file to `comments.config.js` and you're good to go.
