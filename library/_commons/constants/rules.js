import { resolveRuleName, compressRuleName } from "../constants/bases.js";

import makeResolveRule from "../rules/resolve.js";
import makeCompressRule from "../rules/compress.js";

export const ruleNames_makeRules = Object.freeze({
  [resolveRuleName]: makeResolveRule,
  [compressRuleName]: makeCompressRule,
});
