/* exitDueToFailure */

/**
 * Terminates the whole process with a 'failure' code (1).
 * @returns {never} Never. (Somehow typing needs to be explicit for unreachable code inference.)
 */
export const exitDueToFailure = () => process.exit(1);

/* escapeRegex */ // comment-variables-resolve-config

/**
 * Escapes all regex characters with a `"\"` in a string to prepare it for use in a regex.
 * @param {string} string The string.
 * @returns The string with regex characters escaped.
 */
export const escapeRegex = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
