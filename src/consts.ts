const FOLDERS_NODE = {
  eng: "./Update_eng",
  locOld: "./Update_loc",
  locNew: "./Update_loc_new",
};

export const FOLDERS = FOLDERS_NODE;

export const REGEX = /OutputLine(?:All|)\((?:.|\s)*?\);/gm;

export const UND_VAR_REPLACER = "() => null";
