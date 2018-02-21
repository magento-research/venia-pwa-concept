import { Component, createElement } from 'react';
import { connect } from 'react-redux';

class Trigger extends Component {
    render() {
        const { children, className } = this.props;

        return (
            <button className={className} onClick={this.handleClick}>
                {children}
            </button>
        );
    }

    handleClick = () => {
        this.props.dispatch({ type: 'TOGGLE_NAVIGATION' });
    };
}

export default connect()(Trigger);

export { Trigger };
