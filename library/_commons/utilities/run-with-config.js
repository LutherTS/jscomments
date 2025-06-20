import { existsSync } from "fs";
import { pathToFileURL } from "url";

import { z } from "zod";

import { configKeyRegex, flattenedConfigKeyRegex } from "../constants/bases.js";

import { exitDueToFailure } from "../utilities/helpers.js";

function flattenConfigData(
  configData,
  configDataMap = new Map(),
  parentKeys = []
) {
  for (const [key, value] of Object.entries(configData)) {
    const newKeys = [...parentKeys, key];
    const normalizedKey = newKeys
      .map((k) => k.toUpperCase())
      .join("#")
      .replace(/\s/g, "_");
    const source = newKeys.join(" > ");

    if (typeof value === "string") {
      if (configDataMap.has(normalizedKey)) {
        console.error(
          `ERROR. The normalized key "${normalizedKey}" has already been assigned. Check between the two following key paths: \n"${
            configDataMap.get(normalizedKey).source
          }" \n"${source}"`
        );
        exitDueToFailure();
      }

      configDataMap.set(normalizedKey, {
        value,
        source,
      });
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      flattenConfigData(value, configDataMap, newKeys);
    }
  }

  // At this point we're out of the recursion, and we can start working with the complete data.

  // strips metadata
  const map = new Map();
  configDataMap.forEach((value, key) => {
    map.set(key, value.value);
  });

  // makes the flattened config data object
  const flattenedConfigData = Object.fromEntries(map);

  // The integrity of the flattened config data needs to be established before working with it safely.

  const flattenedConfigDataKeysSet = new Set(Object.keys(flattenedConfigData));

  const flattenedConfigDataValuesArray = Object.values(flattenedConfigData);
  const flattenedConfigDataValuesSet = new Set(flattenedConfigDataValuesArray);

  flattenedConfigDataKeysSet.forEach((key) => {
    // checks the reversability of flattenedConfigData
    if (flattenedConfigDataValuesSet.has(key)) {
      console.error(
        `ERROR. The key "${key}" is and shouldn't be among the values of flattenedConfigData.`
      );
      exitDueToFailure();
    }
    if (!flattenedConfigKeyRegex.test(key)) {
      // checks if each key for flattenedConfigData passes the flattenedConfigKeyRegex test
      console.error(
        `ERROR. Somehow the key "${key}" is not properly formatted. (This is mostly an internal mistake.)`
      );
      exitDueToFailure();
    }
  });

  const set = new Set();

  flattenedConfigDataValuesArray.forEach((value) => {
    if (set.has(value)) {
      // checks that no two values are duplicate
      console.error(
        `ERROR. The value "${value}" is already assigned to an existing key.`
      );
      exitDueToFailure();
    }
    set.add(value);
  });

  // Also including the reversed flattened config data.

  const reversedFlattenedConfigData = Object.fromEntries(
    Object.entries(flattenedConfigData).map(([key, value]) => [value, key])
  );

  return {
    flattenedConfigData,
    reversedFlattenedConfigData,
  };
}

export async function runWithConfig(configPath) {
  // Step 1: Check if config file exists
  if (!existsSync(configPath)) {
    console.warn("No config file found. Exiting gracefully.");
    return null;
  }

  // Step 2: Import the config dynamically
  const configModule = await import(pathToFileURL(configPath));
  const config = configModule.default;

  // Step 3: Validate config object
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    console.warn(
      "Invalid config format. The config should be an object. Exiting."
    );
    return null;
  }

  // data

  const RecursiveObject = z
    .lazy(() =>
      z.record(
        z.any().superRefine((val, ctx) => {
          if (typeof val === "string") {
            return;
          }

          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            const parsed = RecursiveObject.safeParse(val);
            if (!parsed.success) {
              for (const issue of parsed.error.issues) {
                ctx.addIssue({
                  ...issue,
                  path: [...ctx.path, ...issue.path], // proper path propagation
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

  const recursiveObjectResult = RecursiveObject.safeParse(config.data);

  if (!recursiveObjectResult.success) {
    console.warn("Config data could not pass validation from zod.");
    recursiveObjectResult.error.errors.map((e) => console.log(e.message));
    return null;
  }

  // ignores

  const StringArraySchema = z.array(
    z.string({
      message: `The config's "ignores" key array should be made of string or be empty.`,
    }),
    {
      message: `The config's "ignores" key value should be an array of strings (or at the very least an empty array).`,
    }
  );

  const stringArraySchemaResult = StringArraySchema.safeParse(config.ignores);

  if (!stringArraySchemaResult.success) {
    console.warn("Config ignores could not pass validation from zod.");
    stringArraySchemaResult.error.errors.map((e) => console.log(e.message));
    return null;
  }

  // Step 4: Do your thing
  console.log("Running with config:", config);
  return {
    ...flattenConfigData(config.data), // finalized
    configPath, // finalized
    passedIgnores: config.ignores, // addressed with --my-ignores-only
  };
}
