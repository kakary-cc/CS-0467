const words = ['a', 'b', 'c']
const obj = words.reduce((newObj, ele, i) => {
    return {...newObj, [ele]: i}
})
console.log(obj)


// function decorator
const debug = fn => {
    const debuggedFn = arg => {
        console.log("prints", arg)
        const ret = fn(arg)
        return ret
    }
    return debuggedFn
}
const debuggedParseInt = debug(parseInt)
console.log(debuggedParseInt('123'))

const cachify = fn => {
    const cache = {}
    const cachedFn = (...args) => {
        const k = JSON.stringify(args)
        if(Object.hasOwn(cache, k)) {
            console.log("cache hit", k)
            return cache[k]
        }
        else {
            console.log("cache miss", k)
            const ret = fn(...args)
            cache[k] = ret
            return ret
        }

    }
    return cachedFn;
}
const cachedParseInt = cachify(parseInt)
console.log(cachedParseInt('101'))
console.log(cachedParseInt('101', 2))
console.log(cachedParseInt('101'))