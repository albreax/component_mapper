import { ComponentMap } from "./ComponentMap.ts";
import { IComponentMap } from "./IComponentMap.ts";

export const buildComponentMap: <T extends {component: string, filepath: string}>(list: T[]) => IComponentMap<T> = 
    list => new ComponentMap(list);