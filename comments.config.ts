import { test } from "./import.js";

const config = {
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
    },
  },
};

export default config;

// This too is level three.

/* Notes
I'll need to install TypeScript to test this.
*/
