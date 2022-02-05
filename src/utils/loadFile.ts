import fs from "fs/promises";

const node = (file: string): Promise<string> =>
  fs.readFile(file, { encoding: "utf-8" });

export const loadFile = (file: string) => node(file);
