export const createLogger = () => {
  const logs = new Map<string, Map<number, any>>();

  const getSize = () => logs.size;

  const add = (fileName: string, errors: any) => {
    logs.set(fileName, errors);
  };

  const showNode = async () => {
    // @ts-ignore
    const { createInterface } = await import("readline/promises");
    // @ts-ignore
    const { stdin, stdout } = await import("process");
    const rl = createInterface({ input: stdin, output: stdout });
    const sorted = Array.from(logs).sort();

    let showTip = true;

    for (const [fileName, errors] of sorted) {
      let answer = "";

      const question = async () =>
        (answer = await rl.question(
          `\nDo you want to go through ${fileName} errors (${errors.size})? (y)es/(a)ll/(n)o : `
        ));

      while (!["a", "y", "n"].includes(answer[0])) {
        await question();
      }

      switch (answer[0]) {
        case "a":
          console.log(errors);
          break;

        case "y":
          showTip && console.log("* Press Enter to show next error");
          showTip && console.log("* To skip current file - type (s)kip");
          showTip && console.log("* To show all errors - type (a)ll");
          showTip = false;

          for (const error of errors) {
            console.log(error);

            const answer = await rl.question("");

            switch (answer[0]) {
              case "s":
                break;

              case "a":
                console.log(errors);
                break;

              default:
                continue;
            }
            break;
          }
          break;

        case "n":
        default:
          break;
      }
    }

    rl.close();
  };

  return {
    getSize,
    add,
    show: showNode,
  };
};
