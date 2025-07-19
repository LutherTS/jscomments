/* exitDueToFailure */

/**
 * $COMMENT#JSDOC#DEFINITIONS#EXITDUETOFAILURE
 * @returns {never} $COMMENT#JSDOC#RETURNS#EXITDUETOFAILURE
 */
export const exitDueToFailure = () => process.exit(1);

/* logError */

/**
 * $COMMENT#JSDOC#DEFINITIONS#LOGERROR
 * @param {{type: "error" | "warning"; message: string}} error $COMMENT#JSDOC#PARAMS#ERROR
 */
export const logError = (error) => {
  switch (error.type) {
    case "error":
      console.error(error.message);
      break;
    case "warning":
      console.warn(error.message);
      break;
    default:
      console.error("ERROR. Error type unrecognized.");
      break;
  }
};
