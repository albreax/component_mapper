interface IResultWriter<D, T> {
    write: (data: D, mapper:(data: D) => T) => void;
}