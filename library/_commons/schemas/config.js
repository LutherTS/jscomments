import { z } from "zod";

import { configKeyRegex } from "../constants/regexes.js";

export const ConfigDataSchema = z
  .lazy(() =>
    z.record(
      z.unknown().superRefine((val, ctx) => {
        if (typeof val === "string") {
          return;
        }

        if (typeof val === "object" && val && !Array.isArray(val)) {
          const parsed = ConfigDataSchema.safeParse(val);
          if (!parsed.success) {
            for (const issue of parsed.error.issues) {
              ctx.addIssue({
                ...issue,
                path: [...ctx.path, ...issue.path],
              });
            }
          }
          return;
        }

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Value \`${val}\` of type "${typeof val}" should be a string or a nested object.`,
          path: ctx.path,
        });
      })
    )
  )
  .superRefine((obj, ctx) => {
    for (const key of Object.keys(obj)) {
      if (key.includes("$")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should not include the "$" character.`,
          path: [key],
        });
      }
      if (key.includes("#")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should not include the "#" character.`,
          path: [key],
        });
      }
      if (!configKeyRegex.test(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should only include whitespaces (s), lowercase letters (Ll), uppercase letters (Lu), other letters (Lo), numbers (N), dash punctuation (Pd), and connector punctuation (Pc).`,
          path: [key],
        });
      }
    }
  });

export const ConfigIgnoresSchema = z.array(
  z.string({
    message: `The config's "ignores" key array should be made of string or be empty.`,
  }),
  {
    message: `The config's "ignores" key value should be an array of strings (or at the very least an empty array).`,
  }
);
