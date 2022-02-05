import { REGEX, UND_VAR_REPLACER } from "../consts";

import { findOutputLineFunctions } from "./findOLfns";
import { getUndefinedVars } from "./getUndefinedVars";
import { loadFile } from "./loadFile";
import { updateVarNames } from "./updateVarNames";

export const prepareOLFns = async (
  path: string
): Promise<
  { errors: null; functions: string[] } | { errors: string[]; functions: null }
> => {
  let undefinedVars: (string | null)[] = [null];

  let functions: string[] = [];

  const content = await loadFile(path);

  functions = findOutputLineFunctions(content, REGEX)!;

  while (undefinedVars.length) {
    const { errors, vars } = getUndefinedVars(functions);

    if (errors) {
      return { errors, functions: null };
    }

    if (vars) {
      undefinedVars = vars;
      undefinedVars.forEach((varName) => {
        functions = updateVarNames(functions, varName!, UND_VAR_REPLACER);
      });
    }
  }

  return { errors: null, functions };
};
