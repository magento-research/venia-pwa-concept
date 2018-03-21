import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import List from 'src/view/List';
import Option from './option';
import defaultClasses from './select.css';

const identity = () => {};

class Select extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.arrayOf(PropTypes.object),
        onChange: PropTypes.func
    };

    state = {
        value: ''
    };

    render() {
        const { props, state } = this;
        const isControlled = !!props.onChange;
        const { value } = isControlled ? props : state;

        return (
            <List
                {...props}
                render="select"
                renderItem={Option}
                value={value}
                onChange={this.handleChange}
            />
        );
    }

    handleChange = event => {
        this.setValue(event.target.value);
    };

    setValue = value => {
        const callback = this.props.onChange || identity;

        this.setState(() => ({ value }), () => callback(value));
    };
}

export default classify(defaultClasses)(Select);
