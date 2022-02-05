import { emulateOLFn } from "./emulateOLFns";

export const getUndefinedVars = (
  fnStrings: string[]
): { errors: null; vars: string[] } | { errors: string[]; vars: null } => {
  const vars = new Set<string>();
  const errors = [];

  if (fnStrings === null) return { errors: null, vars: [] };

  for (const fn of fnStrings) {
    try {
      const fnWithoutComments = fn.replace("//", "");
      emulateOLFn(fnWithoutComments);
    } catch (e) {
      if (e instanceof ReferenceError) {
        const spaceIndex = e.message.indexOf(" ");
        const varName = e.message.slice(0, spaceIndex);

        vars.add(varName);
      } else {
        errors.push(`${(e as Error).name}: ${fn}`);
      }
    }
  }

  if (errors.length) {
    return { errors, vars: null };
  }

  return { errors: null, vars: Array.from(vars) };
};
