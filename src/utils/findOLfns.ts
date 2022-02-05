export const findOutputLineFunctions = (content: string, regex: RegExp) => {
  const matches = content.match(regex);

  return matches;
};
