import { FOLDERS } from "./consts";
import { fixLocStrings } from "./utils/fixLocStrings";

import { getStrings } from "./utils/getStrings";
import { replaceContent } from "./utils/replaceContent";
import { resolvePath } from "./utils/resolvePath";
import { saveFile } from "./utils/saveFile";
import { verify } from "./utils/verify";

export const singleFile = async (
  fileName: string,
  addToLog: (fileName: string, errors: any) => void
): Promise<void> => {
  let error = null;

  const [engPath, locPath, locSavePath] = await Promise.all([
    resolvePath([FOLDERS.eng, fileName]),
    resolvePath([FOLDERS.locOld, fileName]),
    resolvePath([FOLDERS.locNew, fileName]),
  ]);

  const { errors: engErrors, strings: engStrings } = await getStrings(engPath);
  const { errors: locErrors, strings: locStrings } = await getStrings(locPath);

  engErrors && addToLog(`${FOLDERS.eng}/${fileName}`, engErrors);
  locErrors && addToLog(`${FOLDERS.locOld}/${fileName}`, locErrors);

  const [fixedlocStrings, updatedStrings] = fixLocStrings(
    engStrings,
    locStrings
  );

  const autoFixed = updatedStrings.size > 0;

  if (autoFixed) {
    const updatedStringsError = new Map([
      [
        -2,
        [
          `${fileName} was auto-fixed, please check next strings in patched localized script:`,
          updatedStrings,
        ],
      ],
    ]);

    addToLog(fileName, updatedStringsError);
  }

  error = verify(engStrings, fixedlocStrings);

  if (error) {
    addToLog(fileName, error);
    return;
  }

  const locContent = await replaceContent(engPath, engStrings, fixedlocStrings);

  saveFile(locSavePath, locContent);
  !autoFixed && console.log(fileName, "patched successfully!");
  autoFixed && console.log(fileName, "patched with auto-fix!");
};
