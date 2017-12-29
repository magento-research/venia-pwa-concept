export const extract = (obj, name = 'default') =>
    Promise.resolve(obj)
        .then(mod => mod[name])
        .catch(() => {
            throw new Error(`Export ${name} not found.`);
        });
