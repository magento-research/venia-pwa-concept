const proxy = new Proxy(
    {},
    {
        get(target, prop) {
            return prop === '__esModule' ? false : prop;
        }
    }
);

module.exports = proxy;
