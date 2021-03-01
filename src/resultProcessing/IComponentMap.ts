export interface IComponentMap<T>{
    componentList: ReadonlyArray<string>;
    componentMap: ReadonlyArray<T>;
    getMappingsForFile:(filepath: string) => T[]
}