/* eslint-disable */
import { Component, createElement } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Trigger } from 'src/view/Navigation';

import defaultClasses from './header.css';

class Header extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            cartTrigger: PropTypes.string,
            navTrigger: PropTypes.string,
            primaryActions: PropTypes.string,
            root: PropTypes.string,
            searchBlock: PropTypes.string,
            searchInput: PropTypes.string,
            searchTrigger: PropTypes.string,
            secondaryActions: PropTypes.string,
            title: PropTypes.string,
            toolbar: PropTypes.string
        })
    };

    static defaultProps = {
        classes: defaultClasses
    };

    render() {
        const { classes } = this.props;

        return (
            <header className={classes.root}>
                <div className={classes.toolbar}>
                    <h2 className={classes.title}>
                        <span>Venia</span>
                    </h2>
                    <div className={classes.primaryActions}>
                        <Trigger className={classes.navTrigger}>
                            <span>🍔</span>
                        </Trigger>
                    </div>
                    <div className={classes.secondaryActions}>
                        <button className={classes.searchTrigger}>
                            <span>🔍</span>
                        </button>
                        <Link to="/cart" className={classes.cartTrigger}>
                            <span>🛒</span>
                        </Link>
                    </div>
                </div>
                <div className={classes.searchBlock}>
                    <input
                        className={classes.searchInput}
                        type="text"
                        placeholder="I'm looking for..."
                    />
                </div>
            </header>
        );
    }
}

export default Header;
