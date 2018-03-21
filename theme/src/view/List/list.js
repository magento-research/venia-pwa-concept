import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import normalizeArray from 'src/util/normalizeArray';
import fromRenderProp from 'src/util/fromRenderProp';
import Items from './items';

const normalizeItems = (items, getItemKey) =>
    Array.isArray(items) ? normalizeArray(items, getItemKey) : items;

class List extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        getItemKey: PropTypes.func,
        items: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.object),
            PropTypes.objectOf(PropTypes.object)
        ]).isRequired,
        render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    };

    static defaultProps = {
        classes: {},
        getItemKey: ({ id }) => id,
        items: {},
        render: 'div',
        renderItem: 'div'
    };

    render() {
        const {
            classes,
            getItemKey,
            items,
            render,
            renderItem,
            ...restProps
        } = this.props;
        const customProps = { classes, items };
        const normalizedItems = normalizeItems(items, getItemKey);
        const Root = fromRenderProp(render, Object.keys(customProps));

        return (
            <Root className={classes.root} {...customProps} {...restProps}>
                <Items items={normalizedItems} renderItem={renderItem} />
            </Root>
        );
    }
}

export default List;
