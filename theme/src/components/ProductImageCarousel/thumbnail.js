import { Component, createElement, createRef } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './thumbnail.css';

class Thumbnail extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            image: PropTypes.string,
            image_focused: PropTypes.string,
            image_selected: PropTypes.string,
            image_selected_focused: PropTypes.string,
            root: PropTypes.string,
            root_focused: PropTypes.string,
            root_selected: PropTypes.string,
            root_selected_focused: PropTypes.string
        })
    };

    itemRef = createRef();

    componentDidUpdate() {
        if (this.props.hasFocus) {
            this.itemRef.current.focus();
        }
    }

    render() {
        const { item, onBlur, onClick, onFocus } = this.props;
        const eventListeners = { onBlur, onClick, onFocus };

        return (
            <button
                ref={this.itemRef}
                className={this.getClass('root')}
                {...eventListeners}
            >
                <img
                    className={this.getClass('image')}
                    src={`data:image/png;base64,${item.uri}`}
                    alt="thumbnail"
                />
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

export default classify(defaultClasses)(Thumbnail);
