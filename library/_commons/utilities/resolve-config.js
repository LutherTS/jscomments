import fs from "fs";
import url from "url";

import { successFalse, typeError } from "../constants/bases.js";

import { flattenConfigData } from "./flatten-config-data.js";

import { ConfigDataSchema, ConfigIgnoresSchema } from "../schemas/config.js";

/**
 * Verifies, validates and resolves the config path to retrieve the config's data and ignores.
 * @param {string} configPath The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code Extension.
 * @returns The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, and the original config. Errors are returned during failures so they can be reused differently on the CLI and the VS Code Extension.
 */
export async function resolveConfig(configPath) {
  // Step 1: Checks if config file exists

  if (!fs.existsSync(configPath)) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. No config file found.",
        },
      ],
    };
  }

  // Step 2: Imports the config dynamically

  const configModule = /** @type {unknown} */ (
    await import(url.pathToFileURL(configPath))
  );
  const config = /** @type {unknown} */ (configModule.default);

  // Step 3: Validates config object

  // validates config
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. Invalid config format. The config should be an object.",
        },
      ],
    };
  }

  // validates config.data
  const configDataResult = ConfigDataSchema.safeParse(config.data);

  if (!configDataResult.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config data could not pass validation from zod.",
        },
        ...configDataResult.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  // validates config.ignores
  const configIgnoresSchemaResult = ConfigIgnoresSchema.safeParse(
    config.ignores
  );

  if (!configIgnoresSchemaResult.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config ignores could not pass validation from zod.",
        },
        ...configIgnoresSchemaResult.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  const flattenedConfigDataResults = flattenConfigData(configDataResult.data);

  if (!flattenedConfigDataResults.success) {
    return flattenedConfigDataResults;
  }

  // sends back:
  // - the flattened config data,
  // - the reverse flattened config data,
  // - the verified config path
  // - and the raw passed ignores
  return {
    ...flattenedConfigDataResults, // finalized
    configPath, // finalized
    passedIgnores: configIgnoresSchemaResult.data, // addressed with --lint-config-imports and --my-ignores-only to be finalized
    config, // and the config itself too
  };
}
