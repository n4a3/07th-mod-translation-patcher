export type StrError = [
  jpnEngStr: string,
  engStr: string,
  jpnlocStr: string,
  locStr: string
];

export type LocaleMap = Map<number, [jpn: string, loc: string]>;
