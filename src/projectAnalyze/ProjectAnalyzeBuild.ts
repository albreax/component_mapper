import { FileAnalyzer } from "./fileHandler/FileAnalyzer.ts";
import { FileCollector } from "./fileHandler/FileCollector.ts";

export const buildProjectAnalyze = (
  projectPath: string,
  fileExtension: string[],
) => {
  const fileCollection = (new FileCollector(projectPath, fileExtension)).collection;
  const findings = (new FileAnalyzer(fileCollection)).result
  return { fileCollection, findings };
};
