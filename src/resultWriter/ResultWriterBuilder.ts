import { ResultHTMLTableWriter } from "./ResultHTMLTableWriter.ts";
import { ResultJsonWriter } from "./ResultJsonWriter.ts";
import { IResultWriter } from "./IResultWriter.ts";
export class ResultWriterBuilder{
    private resultTargetDataDir: string;
    private resultTargetDir: string
    constructor(resultTargetDir: string) {
        this.resultTargetDir = resultTargetDir;
        this.resultTargetDataDir = resultTargetDir + "/data";
        this.prepareTarget();
    }
    private prepareTarget = () => {
        Deno.mkdirSync(this.resultTargetDataDir, {recursive: true});
    }

    public build : <D, T>(
        type: "html-table" | "json"
    ) => IResultWriter<D, T> = (type) => {
        switch(type) {
            case "html-table":
                return new ResultHTMLTableWriter(this.resultTargetDir);
            case "json":
                return new ResultJsonWriter(this.resultTargetDataDir)
            default: ((t: never) => {
                throw `missing case for type $${t}`;
            })(type);
        }
    }
}
