import {
  resolveRuleName,
  compressRuleName,
} from "comment-variables-resolve-config";

import makeResolveRule from "../rules/resolve.js";
import makeCompressRule from "../rules/compress.js";

export const ruleNames_makeRules = Object.freeze({
  [resolveRuleName]: makeResolveRule,
  [compressRuleName]: makeCompressRule,
});
