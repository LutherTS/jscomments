import {
  $COMMENT,
  placeholderMessageId,
  makeIsolatedStringRegex,
} from "comment-variables-resolve-config";

/**
 * The utility that creates the compress rule based on the reversed flattened config data, used to transform actual comments into `$COMMENT` placeholders.
 * @param {{[key: string]: string}} reversedFlattenedConfigData The reversed flattened config data, with actual comments as keys and `$COMMENT` placeholders as values.
 * @param {string[]} composedVariablesExclusives The array of comment variables keys (implying their aliases as well) exclusively used to craft composed variables, that should be ignored by both the `resolve` and the `compress` commands.
 * @returns The compress rule based on the reversed flattened config data.
 */
const makeRule = (reversedFlattenedConfigData, composedVariablesExclusives) => {
  /** The whole `reversedFlattenedConfigData` turned from an object to an array of key-value arrays sorted by the descending length of each key to prevent partial replacements. */
  const sortedReversedFlattenedConfigData = Object.entries(
    reversedFlattenedConfigData
  ).sort(([a], [b]) => b.length - a.length);

  // makes a set out of composed variables exclusives
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
          // if (composedVariablesExclusives.some((e) => commentKey === e))
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
