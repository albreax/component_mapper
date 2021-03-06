import {IResultWriter} from "./IResultWriter.ts";
export class ResultTexTableWriter<D, T extends  string[][]> implements IResultWriter<D, T> {
    constructor(private resultTargetDir: string, private fileName: string){}

    public write = (data: D, mapper: (data: D) => T) => {
        const mapped = mapper(data);
        const titleData = mapped.shift();

        const title =  " & " + titleData?.map(e => "\\textbf{"+ e +"}").join(" & ") + " \\\\";

        const content =  mapped.map((row, indx) => {
            return indx + " & " + row.join(" & ") + " \\\\\n\\hline \\\\\n" 
        }).join("")

        const textData = "\\begin{tabular}{" + "r" + titleData?.map(() => "l").join("") +"}\n"
        + title + "\n\\hline \\\\\n"
        + content + "\n"
        + "\\end{tabular}";

        const path = this.resultTargetDir + "/" + this.fileName + ".tex";

        Deno.writeTextFileSync(path, textData);
    };
}
