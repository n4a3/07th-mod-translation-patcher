export const emulateOLFn = (fn: string): [string, string] => {
  const OutputLine = (...props: any[]) => {
    const strings: string[] = props.filter((prop) => typeof prop === "string");

    if (!strings.length) return;

    const fixedStrings = strings
      .map((str) => `"${str.replace(/\"/gm, '\\"')}"`)
      .map((str) => str.replace("　", ""))
      .filter((str) => str.length > 0);

    if (fixedStrings.length < 2) return;

    return fixedStrings;
  };

  const OutputLineAll = OutputLine;

  return eval(fn);
};
