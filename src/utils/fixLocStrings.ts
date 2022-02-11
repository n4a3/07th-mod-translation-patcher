import { LocaleMap } from "../types";
import names from "../names.json";

const FIX_STR_TRIGGER = '"<color';
const NAME_REGEX = />(.*)</;

export const fixLocStrings = (
  engMap: LocaleMap,
  locMap: LocaleMap
): [fixedLocMap: LocaleMap, autoFixed: boolean] => {
  let offset = 0;

  const engSize = engMap.size;
  const locSize = locMap.size;

  if (engSize === locSize) return [locMap, false];

  const fixedLocMap: LocaleMap = new Map();

  for (const [id, [jpnEngStr, engStr]] of engMap) {
    const newId = fixedLocMap.size + 1;

    const [jpnLocStr, locStr] = locMap.get(id - offset) || ["", ""];

    const addToLoc =
      jpnEngStr.includes(FIX_STR_TRIGGER) &&
      !jpnLocStr.includes(FIX_STR_TRIGGER);

    if (jpnEngStr !== jpnLocStr) {
      if (addToLoc) {
        fixedLocMap.set(newId, [jpnEngStr, engStr]);
        offset++;
        continue;
      }
    }

    fixedLocMap.set(newId, [jpnLocStr, locStr]);
  }

  return [fixedLocMap, true];
};

export const fixNames = (locMap: LocaleMap): LocaleMap => {
  const fixedLocMap: LocaleMap = new Map();

  const engNames = Object.getOwnPropertyNames(names);

  for (const [id, [jpnLocStr, locStr]] of locMap) {
    const engName = (locStr.match(NAME_REGEX) ?? [])[1];

    if (!engName) {
      fixedLocMap.set(id, [jpnLocStr, locStr]);
      continue;
    }

    const isNameExist = engNames.includes(engName);

    if (!isNameExist) {
      fixedLocMap.set(id, [jpnLocStr, locStr]);
      continue;
    }

    const locName = names[engName as keyof typeof names] ?? engName;
    const fixedLocStr = locStr.replace(engName, locName);

    fixedLocMap.set(id, [jpnLocStr, fixedLocStr]);
  }

  return fixedLocMap;
};
