import { createFactory } from 'react';

const factoryCache = new Map();

const filterProps = (props = {}, blacklist = []) =>
    Object.entries(props).reduce((r, [k, v]) => {
        if (!blacklist.includes(k)) {
            r[k] = v;
        }
        return r;
    }, {});

const fromRenderProp = (elementType, customProps) => {
    const isBasic = typeof elementType === 'string';
    const factory = factoryCache.get(elementType) || createFactory(elementType);

    factoryCache.set(elementType, factory);

    return isBasic
        ? props => factory(filterProps(props, customProps))
        : props => factory(props);
};

export default fromRenderProp;
