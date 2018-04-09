import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';

class Carousel extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            currentImage: PropTypes.string,
            root: PropTypes.string
        }),
        images: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string
            })
        )
    };

    state = {
        selectedIndex: null
    };

    render() {
        const { classes, images } = this.props;
        const { selectedIndex } = this.state;
        const currentImage = images[selectedIndex];
        const src = currentImage && `data:image/png;base64,${currentImage.uri}`;

        return (
            <div className={classes.root}>
                <img className={classes.currentImage} src={src} alt="product" />
                <ThumbnailList
                    items={images}
                    onSelectionChange={this.handleSelectionChange}
                />
            </div>
        );
    }

    handleSelectionChange = selection => {
        const { value: selectedIndex } = selection.values().next();

        this.setState(() => ({ selectedIndex }));
    };
}

export default classify(defaultClasses)(Carousel);
