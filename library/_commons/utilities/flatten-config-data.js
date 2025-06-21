import { flattenedConfigKeyRegex } from "../constants/bases.js";

import { exitDueToFailure } from "../utilities/helpers.js";

/**
 * Flattens the config's data property into a one-dimensional object of $COMMENT-*-like keys and string values.
 * @param {Record<string, any>} configData The config's data property. (Values are typed `any` given the limitations in typing recursive values in JSDoc.)
 * @param {Map<string, {value: string; source: string}>} configDataMap The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.
 * @param {string[]} parentKeys The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings.
 * @returns Both the flattened config data and its reversed version to ensure the strict reversibility of the `resolve` and `compress` commands.
 */
export const flattenConfigData = (
  configData,
  configDataMap = new Map(),
  parentKeys = []
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
    } else if (typeof value === "object" && value && !Array.isArray(value)) {
      /** @type {Record<string, any>} */
      const typedValue = value;

      flattenConfigData(typedValue, configDataMap, newKeys);
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

  /** @type {Set<string>} */
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
};
