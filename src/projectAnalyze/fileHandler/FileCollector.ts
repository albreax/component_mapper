import { IFileCollector } from "./IFileCollector.ts";

export class FileCollector implements IFileCollector {
  private _collection: string[];
  constructor(path: string, extensions: string[]) {
    const matcherStr = "\.[" + extensions.join("|") + "]+$";
    const matcher = new RegExp(matcherStr, "g");
    const matchExtension = (filename: string) => filename.match(matcher);
    const collectFiles = (path: string) => {
      const result: string[] = [];
      for (const dirEntry of Deno.readDirSync(path)) {
        const entityPath = Deno.realPathSync(path + "/" + dirEntry.name);
        if (dirEntry.isDirectory) {
          result.push(...collectFiles(entityPath));
        } else if (
          dirEntry.isFile &&
          matchExtension(dirEntry.name)
        ) {
          result.push(entityPath);
        }
      }
      return result;
    };

    this._collection = collectFiles(path);
  }
  public get collection() {
    return this._collection;
  }
}
