import { createElement } from 'react';

export const filterProps = (props = {}, blacklist = []) =>
    Object.entries(props).reduce((r, [k, v]) => {
        if (!blacklist.includes(k)) {
            r[k] = v;
        }
        return r;
    }, {});

const fromRenderProp = (elementType, customProps) => {
    const isBasic = typeof elementType === 'string';

    return isBasic
        ? props => createElement(elementType, filterProps(props, customProps))
        : props => createElement(elementType, props);
};

export default fromRenderProp;
