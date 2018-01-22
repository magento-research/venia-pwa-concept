import { Component, createElement } from 'react';

const imagePlaceholder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAfCAQAAAC4ua71AAAAGklEQVR42mNkIBkwjmoZ1TKqZVTLqJYRpgUAaP0AIAQAObYAAAAASUVORK5CYII=';

class GalleryItem extends Component {
    render() {
        const { item, showImage } = this.props;

        const loaded = !!(item && showImage);
        const { image, name, price } = item || {};

        return (
            <div className="gallery-item" data-loaded={loaded}>
                <div className="gallery-item-images">
                    <img
                        className="gallery-item-imagePlaceholder"
                        width="300"
                        height="372"
                        src={imagePlaceholder}
                    />
                    <img
                        className="gallery-item-image"
                        width="300"
                        height="372"
                        src={image}
                        onLoad={this.handleLoad}
                        onError={this.handleLoad}
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
        this.props.item.beacon.resolve();
    };
}

export default GalleryItem;
