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
        type: "html-table" | "json" | "component-map" | "not-mapped"
    ) => IResultWriter<D, T> = (type) => {
        switch(type) {
            case "html-table":
                return new ResultHTMLTableWriter(this.resultTargetDir, "HTMLTable.html");
            case "component-map": 
                return new ResultHTMLTableWriter(this.resultTargetDir, "ComponentMap.html");
            case "not-mapped":
                return new ResultHTMLTableWriter(this.resultTargetDir, "NotMapped.html");
            case "json":
                return new ResultJsonWriter(this.resultTargetDataDir);
            default: ((t: never) => {
                throw `missing case for type $${t}`;
            })(type);
        }
    }
}
