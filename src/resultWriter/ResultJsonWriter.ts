export class ResultJsonWriter<D, T> implements IResultWriter<D, T>{

    constructor(private targetDir: string, private fileName: string){}
    public write = (data: D, mapper: (data: D) => T) => {
        Deno.writeTextFileSync(`${this.targetDir}/${this.fileName}.json`, JSON.stringify(mapper(data)))
    };

}