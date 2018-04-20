import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

class Tile extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            classes: PropTypes.shape({
                root: PropTypes.string,
                root_focused: PropTypes.string,
                root_selected: PropTypes.string,
                root_selected_focused: PropTypes.string
            })
        }),
        item: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        })
    };

    render() {
        const { item, onBlur, onClick, onFocus } = this.props;
        const eventListeners = { onBlur, onClick, onFocus };
        const { name } = item;

        return (
            <button
                className={this.getClass('root')}
                title={name}
                {...eventListeners}
            >
                <span>{name}</span>
            </button>
        );
    }

    getClass(key) {
        const { classes, hasFocus, isSelected } = this.props;
        const selected = isSelected ? '_selected' : '';
        const focused = hasFocus ? '_focused' : '';

        return classes[`${key}${selected}${focused}`];
    }
}

export default classify(defaultClasses)(Tile);
