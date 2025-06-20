import { flattenedConfigKeyRegex } from "../constants/bases.js";

import { exitDueToFailure } from "../utilities/helpers.js";

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
};
