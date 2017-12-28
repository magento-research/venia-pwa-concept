export const extract = (obj, name = 'default') =>
    Promise.resolve(obj).then(mod => mod[name]);
