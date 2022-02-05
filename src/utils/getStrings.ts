import { prepareOLFns } from "./prepareOLFns";
import { emulateOLFn } from "./emulateOLFns";
import { LocaleMap } from "../types";

export const getStrings = async (
  path: string
): Promise<{ strings: LocaleMap; errors: string[] | null }> => {
  const { functions, errors } = await prepareOLFns(path);

  const strings: LocaleMap = new Map();
  let counter = 0;

  functions &&
    functions.forEach((fn) => {
      const extractedStrings = emulateOLFn(fn);

      extractedStrings && strings.set(++counter, extractedStrings);
    });

  return { strings, errors };
};
