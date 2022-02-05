const node = (fileList: string[], fileToExclude: string) =>
  fileList.filter((fileName) => fileName !== fileToExclude);

export const excludeFile = (fileList: string[], fileToExclude: string) =>
  node(fileList as string[], fileToExclude);
