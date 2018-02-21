import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import Tile from './tile';
import Trigger from './trigger';

import defaultClasses from './navigation.css';

const CATEGORIES = [
    'dresses',
    'tops',
    'bottoms',
    'skirts',
    'swim',
    'outerwear',
    'shoes',
    'jewelry',
    'accessories'
];

const tiles = CATEGORIES.map(category => (
    <Tile key={category} text={category} />
));

class Navigation extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    static defaultProps = {
        classes: defaultClasses
    };

    render() {
        const { classes, nav } = this.props;
        const className = nav ? classes.open : classes.closed;

        return (
            <aside className={className}>
                <div className={classes.header}>
                    <h2 className={classes.title}>
                        <span>Main Menu</span>
                    </h2>
                    <Trigger className={classes.navTrigger}>
                        <span role="img" aria-label="Hide navigation">
                            ❌
                        </span>
                    </Trigger>
                </div>
                <nav className={classes.tiles}>{tiles}</nav>
                <ul className={classes.items}>
                    <li className={classes.item}>
                        <span className={classes.link}>
                            <span role="img" aria-label="Account">
                                👩
                            </span>
                        </span>
                    </li>
                    <li className={classes.item}>
                        <span className={classes.link}>
                            <span role="img" aria-label="Favorites">
                                💖
                            </span>
                        </span>
                    </li>
                    <li className={classes.item}>
                        <span className={classes.link}>
                            <span role="img" aria-label="Stores">
                                📞
                            </span>
                        </span>
                    </li>
                </ul>
            </aside>
        );
    }
}

export default Navigation;
