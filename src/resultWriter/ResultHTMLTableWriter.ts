import {IResultWriter} from "./IResultWriter.ts";
const fileName = "HTMLTable.html";

const html = (tableContent: string) => (
    `<!DOCTYPE html>`+
    `<html lang="en">`+
    `<head>`+
    `    <meta charset="utf-8" />`+
    `    <title>Result</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" rel="stylesheet">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    ` +
    `<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js">`+
    `</script>`+
    
    `</head>`+
    `<body>`+
    `   <table class="table" data-paging="false" data-filtering="true" data-sorting="true">` + 
        tableContent +
    `   </table>` +
    `</body>`+
    `<script src="ui/footable/js/footable.min.js">`+
    `</script>`+
    `<script>`+
    `jQuery(function($){
        $('.table').footable();
    });` +
    `</script>`+
    `</html>`
);

export class ResultHTMLTableWriter<D, T extends  string[][]> implements IResultWriter<D, T> {
    constructor(private resultTargetDir: string){}
    
    public write = (data: D, mapper: (data: D) => T) => {
        const mapped = mapper(data);
        const titleData = mapped.shift();
        
        const title = " <thead><tr>" +
            titleData?.map(cell => "<th class=\"footable-sortable\">" + cell + "</th>").join("\n")
        + "</tr></thead>";

        const content = "<tbody>" +
            mapped.map(row => {
            return "<tr>" +
                row.map(cell => "<td style=\"display: table-cell;\">" + cell + "</td>").join("\n")
            + "</tr>"
        }).join(("\n")) + "</tbody>";
        
        const htmlData = html(
            title + 
            content
        );

        const path = this.resultTargetDir + "/" + fileName;

        Deno.writeTextFileSync(path, htmlData);
    };
}