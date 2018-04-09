import { createElement } from 'react';

const merge = (...args) => Object.assign({}, ...args);

const withDisplayName = (outer, inner, name) =>
    Object.assign(outer, {
        displayName: `${name}(${inner.displayName ||
            inner.name ||
            'Component'})`
    });

const classify = classes => Inner =>
    withDisplayName(
        props => <Inner {...props} classes={merge(classes, props.classes)} />,
        Inner,
        'Classify'
    );

export default classify;
