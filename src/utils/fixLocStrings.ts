import { LocaleMap } from "../types";

const FIX_STR_TRIGGER = '"<color';

export const fixLocStrings = (
  engMap: LocaleMap,
  locMap: LocaleMap
): [fixedlocMap: LocaleMap, updatedStrings: Set<string>] => {
  let offset = 0;

  const updatedStrings = new Set<string>();

  const engSize = engMap.size;
  const locSize = locMap.size;

  if (engSize === locSize) return [locMap, updatedStrings];

  const fixedlocMap: LocaleMap = new Map();

  for (const [id, [jpnEngStr, engStr]] of engMap) {
    const newId = fixedlocMap.size + 1;

    const [jpnlocStr, locStr] = locMap.get(id - offset) || ["", ""];

    const addToloc =
      jpnEngStr.includes(FIX_STR_TRIGGER) &&
      !jpnlocStr.includes(FIX_STR_TRIGGER);

    if (jpnEngStr !== jpnlocStr) {
      if (addToloc) {
        fixedlocMap.set(newId, [jpnEngStr, engStr]);
        updatedStrings.add(engStr);
        offset++;
        continue;
      }
    }

    fixedlocMap.set(newId, [jpnlocStr, locStr]);
  }

  return [fixedlocMap, updatedStrings];
};
