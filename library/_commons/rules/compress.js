import { placeholderMessageId } from "../constants/bases.js";

import { escapeRegex } from "..//utilities/helpers.js";

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKERULECOMPRESS
 * @param {{[key: string]: string}} reversedFlattenedConfigData $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
 * @returns $COMMENT#JSDOC#RETURNS#MAKERULECOMPRESS
 */
const makeRule = (reversedFlattenedConfigData) => {
  // Turns the whole reversedFlattenedConfig from an object to an array of key-value arrays sorted by the descending length of each key to prevent partial replacements.
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
    create(context) {
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
          const pattern = new RegExp(
            `(?<=\\s|^)${escapeRegex(resolvedValue)}(?=\\s|$)`,
            "g"
          );

          fixedText = fixedText.replace(pattern, () => {
            modified = true;
            return `$COMMENT#${commentKey}`;
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
