// hoffy.mjs

import { readFile } from 'fs';

function getEvenParam(...args) {
    let count = 0;
    const result = args.filter(() => {
        if(count++ % 2 === 0) {
            return true;
        }
        return false;
    });
    return result;
}

function myFlatten(arr2d) {
    const init = [];
    arr2d.reduce((acc, cur) => {
        if (Array.isArray(cur)) {
            cur.reduce((acc2, cur2) => { init.push(cur2); }, 0);
        }
        else {
            init.push(cur);
        }
        return acc;
    }, 0);
    return init;
}

function maybe(fn) {
    return function(...args) {
        let flag;
        args.filter((arg) => flag = (flag || arg === null || arg === undefined));
        if (flag) {
            return undefined;
        }
        return fn(...args);
    };
}

function filterWith(fn) {
    return function (array) {
        return array.filter(fn);
    };
}

function repeatCall(fn, n, arg) {
    [...Array(n).keys()].filter(() => { fn(arg); });
}

function limitCallsDecorator(fn, n) {
    let count = 0;
    return function (arg) {
        if (count++ < n) {
            return fn(arg);
        }
    };
}

function myReadFile(fileName, successFn, errorFn) {
    readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            errorFn(err);
        }
        else {
            successFn(data);
        }
    });
}

function rowsToObjects(data) {
    const ret = [];
    data.rows.filter((row) => {
        let count = 0;
        const obj = {};
        data.headers.filter((header) => { obj[header] = row[count++]; });
        ret.push(obj);
    });
    return ret;
}

export {
    getEvenParam,
    myFlatten,
    maybe,
    filterWith,
    repeatCall,
    limitCallsDecorator,
    myReadFile,
    rowsToObjects
};