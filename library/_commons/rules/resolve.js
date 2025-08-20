import {
  flattenedConfigPlaceholderGlobalRegex,
  placeholderMessageId,
} from "comment-variables-resolve-config";

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKERULERESOLVE
 * @param {{[key: string]: string}} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA
 * @param {string[]} composedVariablesExclusives $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVES
 * @param {{[key: string]: string}} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
 * @returns $COMMENT#JSDOC#RETURNS#MAKERULERESOLVE
 */
const makeRule = (
  flattenedConfigData,
  composedVariablesExclusives,
  aliases_flattenedKeys
) => {
  // NEW!!
  // Transform flattenedConfigData to exclude keys that include... no, that takes compute time. Just ignore.

  /** @type {import('@typescript-eslint/utils').TSESLint.RuleModule<typeof placeholderMessageId, []>} */
  const rule = {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "Resolves $COMMENT#* placeholder(s) in comment line(s) or block(s).",
      },
      messages: {
        [placeholderMessageId]:
          "Resolved $COMMENT#* placeholder(s) in comment line(s) or block(s).",
      },
      fixable: "code",
      schema: [],
    },
    create: (context) => {
      const sourceCode = context.sourceCode;
      const comments = sourceCode
        .getAllComments()
        .filter((e) => e.type !== "Shebang");

      for (const comment of comments) {
        const matches = [
          ...comment.value.matchAll(flattenedConfigPlaceholderGlobalRegex),
        ];

        if (matches.length === 0) continue;

        let fixedText = comment.value;
        let hasValidFix = false;

        for (const match of matches) {
          const fullMatch = match[0]; // e.g. $COMMENT#LEVELONE#LEVELTWO
          const rawKey = match[1]; // e.g. LEVELONE#LEVELTWO
          const key =
            aliases_flattenedKeys?.[rawKey] || // alias
            rawKey; // original
          const replacement = flattenedConfigData[key];

          // NEW
          // The idea is that only comment variables... Okay.
          // The issue is that having a pattern is way too powerful, and can lead to unplanned inconsistencies. It is true that doing it instance by instance, comment variable by comment variable, is painstaking. But it's the more secure in order to fix an issue that is essentially purely cosmetic.
          // Also, focusing exclusively on comment variables and barring aliases (and composed) solves many issues at once and can be checked within resolveConfig. // Done.
          if (replacement && composedVariablesExclusives.some((e) => key === e))
            continue;

          if (replacement) {
            fixedText = fixedText.replace(fullMatch, () => replacement);
            hasValidFix = true;
          }
        }

        if (hasValidFix && fixedText !== comment.value) {
          context.report({
            loc: comment.loc,
            messageId: placeholderMessageId,
            fix(fixer) {
              const range = comment.range;
              const prefix = comment.type === "Block" ? "/*" : "//";
              const suffix = comment.type === "Block" ? "*/" : "";
              const newComment = `${prefix}${fixedText}${suffix}`;

              return fixer.replaceTextRange(range, newComment);
            },
          });
        }
      }

      return {};
    },
  };

  return rule;
};

export default makeRule; // resolve
