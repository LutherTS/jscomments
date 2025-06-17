import { existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

import { z } from "zod";

function flattenConfig(
  config,
  normalizedPath = "",
  map = {},
  pathStack = [],
  reversedFlattenedConfig = {}
) {
  for (const [key, value] of Object.entries(config)) {
    const currentPath = [...pathStack, key];
    normalizedPath = currentPath.map((k) => k.toUpperCase()).join("#");

    if (typeof value === "string") {
      if (map[normalizedPath]) {
        // checks that no two keys are duplicate
        throw new Error(
          `Duplicate normalized key detected: "${normalizedPath}".\nConflict between:\n  - ${
            map[normalizedPath].__source
          }\n  - ${currentPath.join(" > ")}`
        );
      }
      map[normalizedPath] = {
        value,
        __source: currentPath.join(" > "), // for debugging
      };
    } else if (typeof value === "object") {
      flattenConfig(value, normalizedPath, map, currentPath);
    }
  }

  const flattenedConfig = Object.fromEntries(
    Object.entries(map).map(([k, v]) => [k, v.value])
  ); // strip metadata

  const set = new Set();

  // the integrity of the config needs to be established before working with it
  for (const value of Object.values(flattenedConfig)) {
    if (set.has(value)) {
      // checks that no two values are duplicate
      throw new Error(
        `Value "${value}" is already assigned to an existing key.`
      );
    }
    set.add(value);
  }

  for (const [key, value] of Object.entries(flattenedConfig)) {
    reversedFlattenedConfig[value] = key;
  }

  return { flattenedConfig, reversedFlattenedConfig };
}

export async function runWithConfig(rawConfigPath) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const configPath = join(__dirname, rawConfigPath);

  // Step 1: Check if config file exists
  if (!existsSync(configPath)) {
    console.warn("No config file found. Exiting gracefully.");
    return null;
  }

  // Step 2: Import the config dynamically
  const configModule = await import(pathToFileURL(configPath));
  const config = configModule.default;

  // Step 3: Validate config object
  if (!config || typeof config !== "object") {
    console.warn("Invalid config format. Exiting.");
    return null;
  }

  const RecursiveObject = z.lazy(() =>
    z.record(z.union([z.string(), RecursiveObject]))
  );
  const result = RecursiveObject.safeParse(config);

  if (!result.success) {
    console.warn("Config could not pass validation from zod.");
    return null;
  }

  // Step 4: Do your thing
  console.log("Running with config:", config);
  return { ...flattenConfig(config), configPath };
}
