import { FOLDERS } from "./consts";
import { fixLocStrings, fixNames } from "./utils/fixLocStrings";

import { getStrings } from "./utils/getStrings";
import { replaceContent } from "./utils/replaceContent";
import { resolvePath } from "./utils/resolvePath";
import { saveFile } from "./utils/saveFile";
import { verify, verifyLocMap } from "./utils/verify";

export const singleFile = async (
  fileName: string,
  addToLog: (fileName: string, errors: any) => void
): Promise<void> => {
  const [engPath, locPath, locSavePath] = await Promise.all([
    resolvePath([FOLDERS.eng, fileName]),
    resolvePath([FOLDERS.locOld, fileName]),
    resolvePath([FOLDERS.locNew, fileName]),
  ]);

  const { errors: engErrors, strings: engStrings } = await getStrings(engPath);
  const { errors: locErrors, strings: locStrings } = await getStrings(locPath);

  engErrors && addToLog(`${FOLDERS.eng}/${fileName}`, engErrors);
  locErrors && addToLog(`${FOLDERS.locOld}/${fileName}`, locErrors);

  const [fixedLocStrings, autoFixed] = fixLocStrings(engStrings, locStrings);

  if (autoFixed) {
    const updatedStringsError = new Map([
      [-2, `${fileName} was auto-fixed, it may contain some errors`],
    ]);

    addToLog(fileName, updatedStringsError);
  }

  const errors = verify(engStrings, fixedLocStrings);

  if (errors) {
    addToLog(fileName, errors);
    return;
  }

  const fixedLocStringsWithNames = fixNames(fixedLocStrings);

  const untranslatedStrings = verifyLocMap(
    engStrings,
    fixedLocStringsWithNames
  );

  if (untranslatedStrings) {
    const untranslatedStringsError = new Map([
      [
        -3,
        [
          `${fileName} contains some untranslated strings:`,
          untranslatedStrings,
        ],
      ],
    ]);

    addToLog(fileName, untranslatedStringsError);
  }

  const locContent = await replaceContent(
    engPath,
    engStrings,
    fixedLocStringsWithNames
  );

  saveFile(locSavePath, locContent);
  !autoFixed && console.log(fileName, "patched successfully!");
  autoFixed && console.log(fileName, "patched with auto-fix!");
};
