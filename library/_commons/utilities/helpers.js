/* exitDueToFailure */

/**
 * Terminates the whole process with a 'failure' code (`1`).
 * @returns {never} Never. (Somehow typing needs to be explicit for unreachable code inference.)
 */
export const exitDueToFailure = () => process.exit(1);

/* logError */

/**
 * Logs an error to the console depending on its type. (`"error"` or `"warning"`.)
 * @param {{type: "error" | "warning"; message: string}} error The error object being handle for the logging.
 * @returns
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
