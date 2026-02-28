import {
  $COMMENT,
  placeholderMessageId,
  makeIsolatedStringRegex,
} from "comment-variables-resolve-config";

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS
 * @param {{[key: string]: string}} reversedFlattenedConfigData $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
 * @param {string[]} composedVariablesExclusives $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVES
 * @returns $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS
 */
const makeRule = (reversedFlattenedConfigData, composedVariablesExclusives) => {
  /** $COMMENT#JSDOC#CONSTANTS#SORTEDREVERSEDFLATTENEDCONFIGDATA */
  const sortedReversedFlattenedConfigData = Object.entries(
    reversedFlattenedConfigData,
  ).sort(([a], [b]) => b.length - a.length);

  /** $COMMENT#JSDOC#CONSTANTS#COMPOSEDVARIABLESEXCLUSIVESSET */
  const composedVariablesExclusivesSet = new Set(composedVariablesExclusives);

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
      if (!sourceCode) return;

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
          // NEW
          if (composedVariablesExclusivesSet.has(commentKey)) continue;

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
