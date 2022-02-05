import path from "path";
export const resolvePath = (str: string[]): Promise<string> => {
  const node = async () => {
    return path.resolve(...str);
  };

  return node();
};
