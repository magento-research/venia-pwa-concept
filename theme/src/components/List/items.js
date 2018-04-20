import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import ListItem from './item';

class Items extends Component {
    static propTypes = {
        items: PropTypes.oneOfType([
            PropTypes.instanceOf(Map),
            PropTypes.arrayOf(PropTypes.array)
        ]).isRequired,
        renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        selectionModel: PropTypes.oneOf(['check', 'radio'])
    };

    static defaultProps = {
        selectionModel: 'radio'
    };

    state = {
        cursor: null,
        hasFocus: false,
        selection: new Set()
    };

    render() {
        const { items, renderItem } = this.props;
        const { cursor, hasFocus, selection } = this.state;

        return Array.from(items, ([key, item]) => (
            <ListItem
                key={key}
                item={item}
                render={renderItem}
                hasFocus={hasFocus && cursor === index}
                isSelected={selection.has(key)}
                onBlur={this.handleBlur}
                onClick={this.handleClick(key, index)}
                onFocus={this.handleFocus(key, index)}
            />
        ));
    }

    handleBlur = () => {
        this.setState(() => ({
            hasFocus: false
        }));
    };

    handleClick = key => () => {
        const { selectionModel } = this.props;
        const isCheckModel = selectionModel === 'check';
        const isRadioModel = selectionModel === 'radio';
        let selection;

        this.setState(
            ({ selection: prevSelection }) => {
                if (isRadioModel) {
                    selection = new Set().add(key);
                }

                if (isCheckModel) {
                    selection = new Set(prevSelection);

                    if (selection.has(key)) {
                        selection.delete(key);
                    } else {
                        selection.add(key);
                    }
                }

                return { selection };
            },
            () => this.syncSelection(selection)
        );
    };

    handleFocus = (_, index) => () => {
        this.setState(() => ({
            cursor: index,
            hasFocus: true
        }));
    };

    // handleKeyDown = (_, index) => event => {
    //     const { key } = event;
    //     const { items } = this.props;
    //     const minCursor = 0;
    //     const maxCursor = Math.max(Object.keys(items).length - 1, 0);
    //     const operation = keyOperations[key];

    //     if (operation) {
    //         event.preventDefault();
    //     }

    //     this.setState(({ cursor }) => {
    //         const nextState = {};

    //         switch (operation) {
    //             case 'prev': {
    //                 nextState.cursor = Math.max(cursor - 1, minCursor);
    //                 break;
    //             }
    //             case 'next': {
    //                 nextState.cursor = Math.min(cursor + 1, maxCursor);
    //                 break;
    //             }
    //         }

    //         return nextState;
    //     });
    // };

    syncSelection = selection => {
        const { onSelectionChange } = this.props;

        if (onSelectionChange) {
            onSelectionChange(selection);
        }
    };
}

export default Items;
