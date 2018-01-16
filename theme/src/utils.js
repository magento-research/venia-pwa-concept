export const extract = (obj, name = 'default') =>
    Promise.resolve(obj)
        .then(mod => mod[name])
        .catch(error => {
            console.error(error);
            // throw new Error(`Object is not a valid module.`);
        });
