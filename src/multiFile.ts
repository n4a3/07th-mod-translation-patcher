import path from "path";
import fs from "fs";

import { singleFile } from "./singleFile";

import { FOLDERS } from "./consts";
import { excludeFile } from "./utils/excludeFile";
import { createLogger } from "./utils/logger";

type Files = File[] | string[];

const node = async (
  engFiles: string[],
  locOldFiles: string[],
  locNewFiles: string[]
) => {
  const diff = engFiles
    .filter((i) => !locOldFiles.includes(i))
    .concat(locOldFiles.filter((i) => !engFiles.includes(i)));

  diff.forEach((fileToExclude) => {
    engFiles = excludeFile(engFiles, fileToExclude) as string[];
    locOldFiles = excludeFile(locOldFiles, fileToExclude) as string[];

    const filePath = path.resolve(FOLDERS.eng, fileToExclude);
    const newFilePath = path.resolve(FOLDERS.locNew, fileToExclude);
    fs.copyFileSync(filePath, newFilePath);
  });

  console.log("Not found files, copied as-is:", diff);

  if (locNewFiles.length) {
    locNewFiles.forEach((fileToExclude) => {
      engFiles = excludeFile(engFiles, fileToExclude) as string[];
      locOldFiles = excludeFile(locOldFiles, fileToExclude) as string[];
    });

    console.log(
      `Found ${locNewFiles.length} updated localized scripts, it will be skipped:`,
      locNewFiles
    );
  }

  console.log("Files to update:", engFiles, "\n");

  const logger = createLogger();

  await Promise.all(
    engFiles.map((fileName) => singleFile(fileName, logger.add))
  );

  logger.getSize() &&
    console.log("Done! Please check log for any collected errors: \n");
  logger.show();
};

export const multiFile = async (
  engFiles: Files,
  locOldFiles: Files,
  locNewFiles: Files
) =>
  node(engFiles as string[], locOldFiles as string[], locNewFiles as string[]);
