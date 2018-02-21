import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import GalleryItems, { emptyData } from './items';

import defaultClasses from './gallery.css';

class Gallery extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            actions: PropTypes.string.isRequired,
            filters: PropTypes.string.isRequired,
            items: PropTypes.string.isRequired,
            pagination: PropTypes.string.isRequired,
            root: PropTypes.string.isRequired
        }),
        data: PropTypes.arrayOf(PropTypes.object)
    };

    static defaultProps = {
        classes: defaultClasses,
        data: emptyData
    };

    render() {
        const { classes, data } = this.props;
        const hasData = Array.isArray(data) && data.length;
        const items = hasData ? data : emptyData;

        return (
            <div className={classes.root}>
                <div className={classes.actions}>
                    <button>Filter</button>
                    <button>Sort</button>
                </div>
                <div className={classes.items}>
                    <GalleryItems items={items} />
                </div>
                <div className={classes.pagination}>
                    <button>
                        <span>Show More</span>
                    </button>
                </div>
                <div className={classes.filters} />
            </div>
        );
    }
}

export default Gallery;
