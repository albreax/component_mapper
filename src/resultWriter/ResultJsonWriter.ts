export class ResultJsonWriter<D, T> implements IResultWriter<D, T>{

    constructor(private targetDir: string){}
    public write = (data: D, mapper: (data: D) => T) => {
        Deno.writeTextFileSync(`${this.targetDir}/result.json`, JSON.stringify(mapper(data)))
    };

}