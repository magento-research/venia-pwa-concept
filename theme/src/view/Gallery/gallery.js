import { Component, createElement } from 'react';

import GalleryItem from './item';
import { createBeacon } from 'src/utils';

import './gallery.css';

const GalleryItems = ({ items, showImages }) =>
    items.map((item, index) => (
        <GalleryItem key={index} item={item} showImage={showImages} />
    ));

class Gallery extends Component {
    state = {
        imagesAreReady: false
    };

    componentDidMount() {
        this.precacheImages(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.precacheImages(nextProps.data);
        }
    }

    render() {
        const { data } = this.props;
        const { imagesAreReady } = this.state;

        return (
            <div className="gallery">
                <div className="gallery-actions">
                    <button>Filter</button>
                    <button>Sort</button>
                </div>
                <div className="gallery-items">
                    <GalleryItems items={data} showImages={imagesAreReady} />
                </div>
                <div className="gallery-pagination">
                    <button>
                        <span>Show More</span>
                    </button>
                </div>
            </div>
        );
    }

    precacheImages(data) {
        const beacons = [];

        data.forEach(item => {
            if (item && item.image) {
                item.beacon = createBeacon();
                beacons.push(item.beacon);
            }
        });

        Promise.all(beacons).then(responses => {
            if (!responses.length) {
                return;
            }

            this.setState(() => ({
                imagesAreReady: true
            }));
        });
    }
}

export default Gallery;
