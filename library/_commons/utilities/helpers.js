/* exitDueToFailure */

/**
 * $COMMENT#JSDOC#DEFINITIONS#EXITDUETOFAILURE
 * @returns $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE
 */
export const exitDueToFailure = () => process.exit(1);

/**
 * $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRING
 * @returns $COMMENT#JSDOC#RETURNS#ESCAPEREGEX
 */
export const escapeRegex = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
