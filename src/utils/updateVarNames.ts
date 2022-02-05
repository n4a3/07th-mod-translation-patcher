export const updateVarNames = (
  functions: string[],
  varName: string,
  replacer: string
) => {
  const newVars = functions.map((fnStr) => fnStr.replace(varName, replacer));

  return newVars;
};
