import fs from "fs/promises";

export const saveFile = (path: string, content: string) => {
  try {
    fs.writeFile(path, content);
  } catch (e) {
    console.log(e);
  }
};
