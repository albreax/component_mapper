import { buildProjectAnalyze } from "./src/projectAnalyze/ProjectAnalyzeBuild.ts";
import { buildComponentMap } from "./src/resultProcessing/ComponentMapBuilder.ts";
import { ResultWriterBuilder } from "./src/resultWriter/ResultWriterBuilder.ts";

const projectPath = Deno.args.length > 0 && Deno.args[0];

if (!projectPath) {
    console.error("Error: Project path is missing!")
    Deno.exit(1)
}

const extensions = ["ts", "tsx", "md"];
const resultPath = `./result`;
const project = buildProjectAnalyze(projectPath, extensions);

const componentMap = buildComponentMap(project.findings);

const writerBuilder = new ResultWriterBuilder(resultPath);
const htmlWriter = writerBuilder.build("html-table");
const pathFix = (p: string) => p.replace(/^.+src/g, "src");
htmlWriter.write(componentMap.componentMap, (d: typeof componentMap.componentMap) => {
    return [["Pfad", "Komponente"]].concat(d.map(e => [pathFix(e.filepath), e.component]))
});

const jsonWriter = writerBuilder.build("json");
jsonWriter.write(componentMap.componentMap, (d: typeof componentMap.componentMap) => d);

// console.log(project.fileCollection)
// console.log(componentMap)
// console.log(componentMap.getMappingsForFile("/Users/albrecht/freedesign5_clean/src/designToSvgCLI/designToSvgConverter.ts"));