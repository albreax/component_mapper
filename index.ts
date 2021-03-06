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

const componentMap = buildComponentMap(project.findings).componentMap;

const writerBuilder = new ResultWriterBuilder(resultPath);
const pathFix = (p: string) => p.replace(/^.+src/g, "src");
writerBuilder.build("html-table", "HTMLTable").write(componentMap, (d: typeof componentMap) => {
    return [["Pfad", "Komponente"]].concat(d.map(e => [pathFix(e.filepath), e.component]))
});

writerBuilder.build("json", "result").write(componentMap, (d: typeof componentMap) => d);

const map = componentMap.reduce((prev, curr) => {
    const elem = prev.find(e => e.component === curr.component);
    if (elem) {
        elem.pathList.push(curr.filepath);
        return prev;
    } else {
        return [...prev, {component: curr.component, pathList: [curr.filepath]}]
    }
}, [] as {component: string, pathList: string []}[])
.sort((a, b) => a.component > b.component ? 1 : -1);

writerBuilder.build("html-table", "ComponentMap").write(map, (d: typeof map) => {
    return [["Komponente", "Pfade"]].concat(d.map(e => [e.component, e.pathList.map(pathFix).join("<br>")]));
});


const notMapped = project.fileCollection.reduce((prev, curr) => {
    if (curr.indexOf("stories") > -1 || curr.indexOf("scss") > -1) {
        return prev;
    }
    const notMissed = componentMap.find(e => {
        const fp = e.filepath.replace("*", "");
        return curr.indexOf(fp) > -1 
    });

    if (notMissed) {
        return prev;
    } else {
        return [...prev, curr];
    }
}, [] as string[] );

writerBuilder.build("html-table", "NotMapped").write(notMapped, (d: typeof notMapped) => {
    return d.map(e => [e]);
});

writerBuilder.build("tex-table", "ComponentMap").write(map, (d: typeof map) => {
    return [["Komponente", "Pfade"]].concat(d.map(e => [e.component, e.pathList.map(pathFix).join(" \\\\\n & & ")]));
});

// console.log(project.fileCollection)
// console.log(componentMap)
// console.log(componentMap.getMappingsForFile("/Users/albrecht/freedesign5_clean/src/designToSvgCLI/designToSvgConverter.ts"));