import { ResultHTMLTableWriter } from "./ResultHTMLTableWriter.ts";
import { ResultJsonWriter } from "./ResultJsonWriter.ts";
import { ResultTexTableWriter } from "./ResultTexTableWriter.ts";
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
        type: "html-table" | "json" | "tex-table",
        fileName: string,
    ) => IResultWriter<D, T> = (type, fileName) => {
        switch(type) {
            case "html-table":
                return new ResultHTMLTableWriter(this.resultTargetDir, fileName);
            case "json":
                return new ResultJsonWriter(this.resultTargetDataDir, fileName);
            case "tex-table":
                return new ResultTexTableWriter(this.resultTargetDataDir, fileName);
            default: ((t: never) => {
                throw `missing case for type $${t}`;
            })(type);
        }
    }
}
