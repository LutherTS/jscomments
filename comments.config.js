const config = {
  // for testing
  levelOne: {
    levelTwo: {
      levelThree: "Level three.",
      // levelthree: "Also level three.", // errors
      // alsoLevelThree: "Level three.", // errors
      levelThreeBis: "Level three bis.",
      levelThreeTer: "Level three ter.",
      levelThreeAlso: "Also level three here.",
      levelThreeToo: "This too is level three.",
      // test: "LEVELONE#LEVELTWO#LEVELTHREE", // errors
      // [`level$Three#First
      //   whitespace`]: `This is level three
      // with whitespaces. `, // fails
      // testing: 2, // fails
      // ".'e": "",
    },
  },
  // for deving
  jsDoc: {
    exitDueToFailure: "Terminates the whole process with a 'failure' code (1).",
  },
};

// export default config;

const trueConfig = {
  data: config,
  ignores: ["chocolat.js"],
};

export default trueConfig;
