/* exitDueToFailure */

/**
 * Terminates the whole process with a 'failure' code (1).
 * @returns Never.
 */
export const exitDueToFailure = () => process.exit(1);

/**
 * Escapes all regex characters with a `"\"` in a string to prepare it for use in a regex.
 * @param {string} string The string.
 * @returns The string with regex characters escaped.
 */
export const escapeRegex = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
