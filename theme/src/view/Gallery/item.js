import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

// generate a 300x372 transparent png
const imagePlaceholder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAfCAQAAAC4ua71AAAAGklEQVR42mNkIBkwjmoZ1TKqZVTLqJYRpgUAaP0AIAQAObYAAAAASUVORK5CYII=';

// inline the placeholder element, since it's constant
const itemPlaceholder = (
    <div className="gallery-item" data-loaded={false}>
        <div className="gallery-item-images">
            <img
                className="gallery-item-imagePlaceholder"
                width="300"
                height="372"
                src={imagePlaceholder}
                alt=""
            />
        </div>
        <div className="gallery-item-name" />
        <div className="gallery-item-price" />
    </div>
);

class GalleryItem extends Component {
    static propTypes = {
        item: PropTypes.shape({
            image: PropTypes.string,
            name: PropTypes.string,
            price: PropTypes.string
        }),
        placeholder: PropTypes.bool,
        showImage: PropTypes.bool
    };

    render() {
        const { item, placeholder, showImage } = this.props;

        if (placeholder) {
            return itemPlaceholder;
        }

        const loaded = !!(item && showImage);
        const { image, name, price } = item;

        return (
            <div className="gallery-item" data-loaded={loaded}>
                <div className="gallery-item-images">
                    <img
                        className="gallery-item-imagePlaceholder"
                        width="300"
                        height="372"
                        src={imagePlaceholder}
                        alt=""
                    />
                    <img
                        className="gallery-item-image"
                        width="300"
                        height="372"
                        src={image}
                        alt={name}
                        onLoad={this.handleLoad}
                        onError={this.handleError}
                    />
                </div>
                <div className="gallery-item-name">
                    <span>{name}</span>
                </div>
                <div className="gallery-item-price">
                    <span>{price}</span>
                </div>
            </div>
        );
    }

    handleLoad = () => {
        const { item, onLoad } = this.props;

        onLoad(item.key);
    };

    handleError = () => {
        const { item, onError } = this.props;

        onError(item.key);
    };
}

export default GalleryItem;
