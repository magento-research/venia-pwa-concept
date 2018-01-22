export function createBeacon() {
    let resolve, reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    return Object.assign(promise, { resolve, reject });
}

export const extract = (obj, name = 'default') =>
    Promise.resolve(obj)
        .then(mod => mod[name])
        .catch(() => {
            throw new Error(`Object is not a valid module.`);
        });
