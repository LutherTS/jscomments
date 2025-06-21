import { existsSync } from "fs";
import { pathToFileURL } from "url";

import { flattenConfigData } from "./flatten-config-data.js";

import { ConfigDataSchema, ConfigIgnoresSchema } from "../schemas/config.js";

/**
 * Verifies, validates and resolves the config path to retrieve the config's data and ignores.
 * @param {string} configPath The path of the config, either from `comments.config.js` or from a config passed via the `--config` flag.
 * @returns The flattened config data, the reverse flattened config data, the verified config path and the raw passed ignores.
 */
export async function resolveConfig(configPath) {
  // Step 1: Checks if config file exists

  if (!existsSync(configPath)) {
    console.warn("No config file found. Exiting gracefully.");
    return null;
  }

  // Step 2: Imports the config dynamically

  const configModule = await import(pathToFileURL(configPath));
  const config = configModule.default;

  // Step 3: Validates config object

  // validates config
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    console.warn(
      "Invalid config format. The config should be an object. Exiting."
    );
    return null;
  }

  // validates config.data
  const configDataResult = ConfigDataSchema.safeParse(config.data);

  if (!configDataResult.success) {
    console.warn("Config data could not pass validation from zod.");
    configDataResult.error.errors.map((e) => console.log(e.message));
    return null;
  }

  // validates config.ignores
  const configIgnoresSchemaResult = ConfigIgnoresSchema.safeParse(
    config.ignores
  );

  if (!configIgnoresSchemaResult.success) {
    console.warn("Config ignores could not pass validation from zod.");
    configIgnoresSchemaResult.error.errors.map((e) => console.log(e.message));
    return null;
  }

  // sends back:
  // - the flattened config data,
  // - the reverse flattened config data,
  // - the verified config path
  // - and the raw passed ignores
  console.log("Running with config:", config);
  return {
    ...flattenConfigData(configDataResult.data), // finalized
    configPath, // finalized
    passedIgnores: configIgnoresSchemaResult.data, // addressed with --lint-config-imports and --my-ignores-only to be finalized
    config, // and the config itself too
  };
}
