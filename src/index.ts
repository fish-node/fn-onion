type NextFunc = () => void;

export type MiddlewareFunc = (next: NextFunc, ...args: any) => void;

export default function(middleware: MiddlewareFunc[]) {

    // 返回compose后的数组
    return async (...args: any) => {
        async function dispatch(i: number): Promise<any> {

            // 如果i的值等于middleware.length,说明到头了
            if (i >= middleware.length) {
                return Promise.resolve();
            }

            const fn = middleware[i];

            // 执行当前函数，同时传入next来允许它调用下一个函数
            return await fn(function next() {
                    return dispatch(i + 1);
                }, ...args);

        }

        // 从第0个函数开始执行
        return await dispatch(0);
    };
}
