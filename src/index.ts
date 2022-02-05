import path from "path";
import fs from "fs";
import { FOLDERS } from "./consts";
import { multiFile } from "./multiFile";
import { argv } from "process";
import { singleFile } from "./singleFile";
import { createLogger } from "./utils/logger";

const engPath = path.resolve(FOLDERS.eng);
const locOldPath = path.resolve(FOLDERS.locOld);
const locNewPath = path.resolve(FOLDERS.locNew);

const entry = async (single?: string) => {
  if (single) {
    const logger = createLogger();
    await singleFile(single, logger.add);

    logger.getSize() &&
      console.log("Done! Please check log for any collected errors: \n");
    logger.show();
    return;
  }

  const readDir = (path: string) =>
    fs.readdirSync(path).filter((fileName) => fileName.includes(".txt"));

  let engFiles = readDir(engPath);

  let locOldFiles = readDir(locOldPath);

  if (!fs.existsSync(locNewPath)) {
    fs.mkdirSync(locNewPath);
  }

  const locNewFiles = readDir(locNewPath);

  console.log(
    `Loaded ${engFiles.length} english and ${locOldFiles.length} localized scripts`
  );

  multiFile(engFiles, locOldFiles, locNewFiles);
};

const singleFileArgIdx = argv.indexOf("-s");

const singleFileName =
  singleFileArgIdx > 0 ? argv[singleFileArgIdx + 1] : undefined;

entry(singleFileName);
