import assert from "assert";
import {MiddlewareFunc} from "../src";
import compose from "../src/index";

describe("compose middleware to onion function", () => {
    it("compose normal function", () => {
        const result: number[] = [];
        const middleware: MiddlewareFunc[] = [];
        middleware[0] = (next) => {
            result.push(1);   // should execute first
            next();
            result.push(3);   // should execute third
        };
        middleware[1] = async (next) => {
            result.push(2);   // should execute second
        };
        middleware[2] = (next) => {
            result.push(-1);  // should not execute
        };
        const fn = compose(middleware);
        fn();
        console.log(result);

        assert.strictEqual(result[0], 1);
        assert.strictEqual(result[1], 2);
        assert.strictEqual(result[2], 3);
        assert.strictEqual(result.length, 3);
    });

    it("should handle with async function", (done) => {
        // 一个简单的异步函数，用来做测试
        const asyncFunc = (arr: number[], value: number) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    arr.push(value);
                    resolve();
                }, 10);
            });
        };

        const array: number[] = [];
        const middleware: MiddlewareFunc[] = [];
        middleware[0] = async (next) => {
            await asyncFunc(array, 1);
            await next();
            await asyncFunc(array, 4);
        };
        middleware[1] = async (next) => {
            await next();
            await asyncFunc(array, 3);
        };
        middleware[2] = async (next) => {
            await asyncFunc(array, 2);
        };

        const fn = compose(middleware);
        (async () => {
            await fn();
            console.log(array);
            assert.strictEqual(array[0], 1);
            assert.strictEqual(array[1], 2);
            assert.strictEqual(array[2], 3);
            assert.strictEqual(array[3], 4);
            assert.strictEqual(array.length, 4);
            done();
        })();
    });

    it("should handle with args", () => {
        const array: number[] = [];
        const middleware: MiddlewareFunc[] = [];
        middleware[0] = (next, foo, bar, biu) => {
            array.push(foo);
            next();
        };
        middleware[1] = (next, foo, bar, biu) => {
            array.push(bar);
            next();
        };
        middleware[2] = (next, foo, bar, biu) => {
            array.push(biu);
            next();
        };

        const fn = compose(middleware);
        fn("foo", "bar", "biu");

        assert.strictEqual(array[0], "foo");
        assert.strictEqual(array[1], "bar");
        assert.strictEqual(array[2], "biu");
        assert.strictEqual(array.length, 3);
    });
});
