export type StrError = [
  jpnEngStr: string,
  engStr: string,
  jpnLocStr: string,
  locStr: string
];

export type LocaleMap = Map<number, [jpn: string, loc: string]>;
