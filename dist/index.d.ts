declare type NextFunc = () => void;
export declare type MiddlewareFunc = (next: NextFunc, ...args: any) => void;
export default function (middleware: MiddlewareFunc[]): (...args: any) => Promise<any>;
export {};
