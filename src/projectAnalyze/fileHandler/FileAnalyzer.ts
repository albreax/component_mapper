import { IFileAnalyzer } from "./IFileAnalyzer.ts";

const matcher = /@component{(.+)}/ig;
export class FileAnalyzer<T extends {
    filepath: string;
    line: number;
    component: string;
}> implements IFileAnalyzer<T> {
  private _result: T[];
  constructor(filelist: string[]) {
    this._result = filelist.map(this.findComponent)
      .reduce((p, c) => p.concat(c), [] as T[]);
  }

  public get result() {
    return this._result;
  }

  private findComponent = (
    filepath: string,
  ) => {
      
    if (filepath.indexOf("_component.md") > -1) {
        return this.findComponentInMD(filepath)
    }

    return this.findComponentTagsInFile(filepath);
  }

  private findComponentInMD = (filepath: string) => {
    const data: string = Deno.readTextFileSync(filepath).split("\n").shift() || "";
    const f = filepath.replace("_component.md", "*");
    return [{filepath: f, component: data.replace("#", "").trim(), line: 0, } as T]
  }

  private findComponentTagsInFile = (
    filepath: string,
  ) => {
    const data = Deno.readTextFileSync(filepath).split("\n");

    return data.reduce((prev, curr, line) => {
      const res = matcher.exec(curr);
      if (res) {
        const component = res[1];
        return [...prev, { filepath, line, component } as T];
      }
      return prev;
    }, [] as T[]);
  };
  
}
