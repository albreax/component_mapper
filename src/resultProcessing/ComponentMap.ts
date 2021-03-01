import { IComponentMap } from "./IComponentMap.ts";

export class ComponentMap<T extends {component: string, filepath: string}> implements IComponentMap<T>{

    public componentList: ReadonlyArray<string>;

    constructor(public componentMap: ReadonlyArray<T>){
        this.componentList = componentMap.reduce(
            (prev, curr) => 
                prev.indexOf(curr.component) > -1
                ? prev
                : [...prev, curr.component]
            , 
            [] as string[]
        );
    }
    public getMappingsForFile = (filepath: string)  => 
        this.componentMap.filter(e => e.filepath === filepath)
}