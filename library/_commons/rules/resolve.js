import {
  flattenedConfigPlaceholderGlobalRegex,
  placeholderMessageId,
} from "comment-variables-resolve-config";

/**
 * The utility that creates the resolve rule based on the flattened config data, used to transform `$COMMENT` placeholders into actual comments.
 * @param {{[key: string]: string}} flattenedConfigData The flattened config data, with `$COMMENT` placeholders as keys and actual comments as values.
 * @param {{[key: string]: string}} aliases_flattenedKeys The dictionary that connects aliases to their original flattened keys in case an encountered placeholder is actually an alias.
 * @returns The resolve rule based on the flattened config data.
 */
const makeRule = (flattenedConfigData, aliases_flattenedKeys) => {
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
          const key = match[1]; // e.g. LEVELONE#LEVELTWO
          const replacement =
            flattenedConfigData[key] || // original
            flattenedConfigData[aliases_flattenedKeys?.[key]]; // alias
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
