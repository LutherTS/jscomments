import { successFalse, successTrue, typeError } from "../constants/bases.js";
import { flattenedConfigKeyRegex } from "../constants/regexes.js";

/**
 * @typedef {Record<string, unknown>} ConfigData
 *
 * @typedef {{
 *   success: false;
 *   errors: Array<{ type: "error" | "warning"; message: string }>;
 * } | {
 *   success: true;
 *   flattenedConfigData: Record<string, string>;
 *   reversedFlattenedConfigData: Record<string, string>;
 * }} FlattenConfigDataResults
 */

/**
 * Flattens the config's data property into a one-dimensional object of $COMMENT-*-like keys and string values.
 * @param {ConfigData} configData The config's data property. (Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)
 * @param {Object} [options] The additional options as follows:
 * @param {Map<string, {value: string; source: string}>} [options.configDataMap] The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.
 * @param {string[]} [options.parentKeys] The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings (`[]`).
 * @returns Both the flattened config data and its reversed version to ensure the strict reversibility of the `resolve` and `compress` commands in a success object (`success: true`). Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code Extension in a failure object (`success: false`).
 */
export const flattenConfigData = (
  configData,
  { configDataMap = new Map(), parentKeys = [] } = {}
) => {
  for (const [key, value] of Object.entries(configData)) {
    const newKeys = [...parentKeys, key];
    const normalizedKey = newKeys
      .map((k) => k.toUpperCase())
      .join("#")
      .replace(/\s/g, "_");
    const source = newKeys.join(" > ");

    if (typeof value === "string") {
      if (configDataMap.has(normalizedKey)) {
        // checks the uniqueness of each normalized key
        return {
          ...successFalse,
          errors: [
            {
              ...typeError,
              message: `ERROR. The normalized key "${normalizedKey}" has already been assigned. Check between the two following key paths: \n"${
                configDataMap.get(normalizedKey).source
              }" \n"${source}"`,
            },
          ],
        };
      }

      configDataMap.set(normalizedKey, {
        value,
        source,
      });
    } else if (typeof value === "object" && value && !Array.isArray(value)) {
      const subConfigData = /** @type {ConfigData} */ (value);
      const flattenConfigDataOptions = { configDataMap, parentKeys: newKeys };

      const flattenConfigDataResults = /** @type {FlattenConfigDataResults} */ (
        flattenConfigData(subConfigData, flattenConfigDataOptions)
      );
      if (!flattenConfigDataResults.success) return flattenConfigDataResults;
    }
  }

  // At this point we're out of the recursion, and we can start working with the complete data.

  // strips metadata
  /**@type {Map<string, string>} */
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

  for (const key of flattenedConfigDataKeysSet) {
    if (flattenedConfigDataValuesSet.has(key)) {
      // checks the reversability of flattenedConfigData
      return {
        ...successFalse,
        errors: [
          {
            ...typeError,
            message: `ERROR. The key "${key}" is and shouldn't be among the values of flattenedConfigData.`,
          },
        ],
      };
    }
    if (!flattenedConfigKeyRegex.test(key)) {
      // checks if each key for flattenedConfigData passes the flattenedConfigKeyRegex test
      return {
        ...successFalse,
        errors: [
          {
            ...typeError,
            message: `ERROR. Somehow the key "${key}" is not properly formatted. (This is mostly an internal mistake.)`,
          },
        ],
      };
    }
  }

  /** @type {Set<string>} */
  const set = new Set();

  for (const value of flattenedConfigDataValuesArray) {
    if (set.has(value)) {
      console.log("errors, duplicate value");
      // checks that no two values are duplicate
      return {
        ...successFalse,
        errors: [
          {
            ...typeError,
            message: `ERROR. The value "${value}" is already assigned to an existing key.`,
          },
        ],
      };
    }
    set.add(value);
  }

  // Also including the reversed flattened config data.

  const reversedFlattenedConfigData = Object.fromEntries(
    Object.entries(flattenedConfigData).map(([key, value]) => [value, key])
  );

  return {
    ...successTrue,
    flattenedConfigData,
    reversedFlattenedConfigData,
  };
};
