export const coroutine = fn => (...args) => {
    const obj = fn(...args);
    obj.next();
    return obj;
};

export const extract = (obj, name = 'default') =>
    Promise.resolve(obj)
        .then(mod => mod[name])
        .catch(() => {
            throw new Error(`Object is not a valid module.`);
        });
