import { LocaleMap } from "../types";
import { loadFile } from "./loadFile";

export const replaceContent = async (
  engPath: string,
  engStrings: LocaleMap,
  locStrings: LocaleMap
) => {
  const engContent = await loadFile(engPath);
  let locContent = engContent;

  for (const [id, [_engJpnStr, engStr]] of engStrings) {
    const [_locJpnStr, locStr] = locStrings.get(id)!;
    locContent = locContent.replace(engStr, locStr);
  }

  return locContent;
};
