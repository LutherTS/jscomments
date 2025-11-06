import { forTesting } from "./for-testing.js";
import { forDeving } from "./for-deving.js";

export const coreData = Object.freeze({
  ...forTesting,
  ...forDeving,
});
