import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Icon from 'src/view/Icon';
import defaultClasses from './swatch.css';

const checkIcon = <Icon name="check" />;

class Swatch extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            icon: PropTypes.string,
            icon_focused: PropTypes.string,
            icon_selected: PropTypes.string,
            icon_selected_focused: PropTypes.string,
            root: PropTypes.string,
            root_focused: PropTypes.string,
            root_selected: PropTypes.string,
            root_selected_focused: PropTypes.string
        }),
        item: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        })
    };

    render() {
        const { isSelected, item, onBlur, onClick, onFocus } = this.props;
        const eventListeners = { onBlur, onClick, onFocus };
        const { id, name } = item;
        const style = { '--swatch-color': id };

        return (
            <button
                className={this.getClass('root')}
                title={name}
                style={style}
                {...eventListeners}
            >
                {isSelected && checkIcon}
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

export default classify(defaultClasses)(Swatch);
