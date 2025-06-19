/* exitDueToFailure */

/**
 * Terminates the whole process with a 'failure' code (1).
 * @returns Never.
 */
export const exitDueToFailure = () => process.exit(1);
