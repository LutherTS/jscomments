import { forTesting } from "./for-testing.js";
import { forDeving } from "./for-deving.js";

export const coreData = Object.freeze({
  ...forTesting,
  ...forDeving,
});

export const composedVariablesExclusives = []; // can be omitted

// NEW from v2
export const variations = undefined; // can be omitted
