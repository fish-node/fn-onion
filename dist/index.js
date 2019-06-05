"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(middleware) {
    // 返回compose后的数组
    return async (...args) => {
        async function dispatch(i) {
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
exports.default = default_1;
