import { LocaleMap, StrError } from "../types";

const IGNORE_REGEX = /\?\?\?|\.\.\.|size/;

const notFoundArr = ["!!not found jpn!!", "!!not found loc!!"];

export const verify = (
  engMap: LocaleMap,
  locMap: LocaleMap
): null | Map<number, StrError | string> => {
  const errors = new Map<number, StrError | string>();

  const engSize = engMap.size;
  const locSize = locMap.size;

  if (engSize !== locSize) {
    errors.set(-1, `Size doesn't match, eng ${engSize} and loc ${locSize}`);
  }

  for (const [id, [jpnEngStr, engStr]] of engMap) {
    const [jpnLocStr, locStr] = locMap.get(id) || notFoundArr;

    if (jpnEngStr !== jpnLocStr) {
      errors.set(id, [jpnEngStr, engStr, jpnLocStr, locStr]);
    }
  }

  if (errors.size) {
    return errors;
  }

  return null;
};

export const verifyLocMap = (
  engMap: LocaleMap,
  locMap: LocaleMap
): null | Map<number, string> => {
  const errors = new Map();

  for (const [id, [jpnEngStr, engStr]] of engMap) {
    if (engStr.search(IGNORE_REGEX)) continue;

    const [jpnLocStr, locStr] = locMap.get(id) || notFoundArr;

    if (jpnEngStr === jpnLocStr && engStr === locStr) {
      errors.set(id, engStr);
    }
  }

  if (errors.size) {
    return errors;
  }

  return null;
};
