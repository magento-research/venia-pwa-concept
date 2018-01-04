import { Component, createElement } from 'react';

class GalleryItem extends Component {
    render() {
        const { name, price } = this.props.item;

        return (
            <div className="gallery-item">
                <div className="gallery-item-image" />
                <div className="gallery-item-name">
                    <span>{name}</span>
                </div>
                <div className="gallery-item-price">
                    <span>{price}</span>
                </div>
            </div>
        );
    }
}

const defaultProps = {
    items: Array.from({ length: 12 }, () => null)
};

const GalleryItems = ({ items } = defaultProps) =>
    items.map(item => <GalleryItem key={item.name} item={item} />);

class Gallery extends Component {
    render() {
        const { data } = this.props;

        return (
            <div className="gallery">
                <div className="gallery-actions">
                    <button>Filter</button>
                    <button>Sort</button>
                </div>
                <GalleryItems items={data} />
                <div className="gallery-pagination">
                    <button>
                        <span>Show More</span>
                    </button>
                </div>
            </div>
        );
    }
}

export default Gallery;
