import {
  $COMMENT,
  placeholderMessageId,
  makeIsolatedStringRegex,
} from "comment-variables-resolve-config";

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS
 * @param {{[key: string]: string}} reversedFlattenedConfigData $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
 * @returns $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS
 */
const makeRule = (reversedFlattenedConfigData) => {
  /** $COMMENT#JSDOC#CONSTANTS#SORTEDREVERSEDFLATTENEDCONFIGDATA */
  const sortedReversedFlattenedConfigData = Object.entries(
    reversedFlattenedConfigData
  ).sort(([a], [b]) => b.length - a.length);

  /** @type {import('@typescript-eslint/utils').TSESLint.RuleModule<typeof placeholderMessageId, []>} */
  const rule = {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "Compresses comments into $COMMENT#* placeholder(s) in comment line(s) or block(s).",
      },
      messages: {
        [placeholderMessageId]:
          "Compressed comments into $COMMENT#* placeholder(s) in comment line(s) or block(s).",
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
        let fixedText = comment.value;
        let modified = false;

        for (const [
          resolvedValue,
          commentKey,
        ] of sortedReversedFlattenedConfigData) {
          // if (composedVariablesExclusives.some((e) => commentKey.startsWith(e))) continue
          const pattern = makeIsolatedStringRegex(resolvedValue);

          fixedText = fixedText.replace(pattern, () => {
            modified = true;
            return `${$COMMENT}#${commentKey}`;
          });
        }

        if (modified && fixedText !== comment.value) {
          context.report({
            loc: comment.loc,
            messageId: placeholderMessageId,
            fix(fixer) {
              const fullCommentText =
                comment.type === "Block"
                  ? `/*${fixedText}*/`
                  : `//${fixedText}`;
              return fixer.replaceText(comment, fullCommentText);
            },
          });
        }
      }

      return {};
    },
  };

  return rule;
};

export default makeRule; // compress
