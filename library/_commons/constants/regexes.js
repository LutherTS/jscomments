import { $COMMENT } from "./bases.js";

import { escapeRegex } from "../utilities/helpers.js";

// comment-variables-resolve-config
export const configKeyRegex = /^[\p{Ll}\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}\s]+$/u;
// comment-variables-resolve-config
export const flattenedConfigKeyRegex = /^[\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}#]+$/u; // same as configKeyRegex but without lowercase letters (\p{Ll}), without whitespaces (\s which are replaced by underscores) and with the '#' character (that links each subkey together)
// comment-variables-resolve-config
export const flattenedConfigPlaceholderRegex = new RegExp(
  `${escapeRegex($COMMENT)}#([\\p{Lu}\\p{Lo}\\p{Pd}\\p{Pc}\\p{N}#_]+)`,
  "gu"
); // same as flattenedConfigKeyRegex but taking the prefix $COMMENT and its # into consideration, removing ^ and $ in the capture group, and using _ as replacement for whitesplaces, globally
