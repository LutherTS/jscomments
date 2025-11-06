// import {
//   coreData as data,
//   composedVariablesExclusives,
//   variations,
// } from "./jscomments/core/data.js";
import {
  variationsData as data,
  composedVariablesExclusives,
  variations,
} from "./jscomments/variations/data.js";

const ignores = ["README.md", "generate.template.js", "generate.example.js"];

const lintConfigImports = false; // can be omitted
const myIgnoresOnly = false; // can be omitted

const config = {
  data,
  ignores,
  lintConfigImports,
  myIgnoresOnly,
  composedVariablesExclusives,
  variations,
};

export default config;
