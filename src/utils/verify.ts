import { LocaleMap, StrError } from "../types";

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
    const [jpnlocStr, locStr] = locMap.get(id) || notFoundArr;

    if (jpnEngStr !== jpnlocStr) {
      errors.set(id, [jpnEngStr, engStr, jpnlocStr, locStr]);
    }
  }

  if (errors.size) {
    return errors;
  }

  return null;
};

const verifyLocMap = (locMap: LocaleMap) => {
  const errors = new Map();

  for (const [id, [_, locStr]] of locMap) {
    if (/[a-zA-Z]/.test(locStr)) {
      const hasHTMLTags = /<.*>/.test(locStr);
      const hasXCensor = /[xX]*/.test(locStr);

      const ignore = hasHTMLTags || hasXCensor;

      !ignore && errors.set(id, locStr);
    }
  }

  if (errors.size) {
    console.log(errors);

    return false;
  }

  return true;
};
