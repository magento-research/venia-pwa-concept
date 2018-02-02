import { Component, createElement } from 'react';

import GalleryItem from './item';
import { coroutine } from 'src/utils';

const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);

const placeholders = emptyData.map((_, index) => (
    <GalleryItem key={index} placeholder={true} />
));

const createCollection = coroutine(function*() {
    for (let i = 0; i < pageSize; i++) {
        yield;
    }

    return;
});

class GalleryItems extends Component {
    state = {
        collection: null,
        done: false
    };

    componentWillReceiveProps(nextProps) {
        const { items } = this.props;
        const { items: nextItems } = nextProps;

        if (nextItems === emptyData || nextItems === items) {
            return;
        }

        this.setState(() => ({
            collection: createCollection(),
            done: false
        }));
    }

    render() {
        const { items } = this.props;
        const { done } = this.state;

        if (items === emptyData) {
            return placeholders;
        }

        return items.map(item => (
            <GalleryItem
                key={item.key}
                item={item}
                showImage={done}
                onLoad={this.onLoad}
                onError={this.onError}
            />
        ));
    }

    onLoad = key => {
        const { done } = this.state.collection.next(key);

        this.setState(() => ({ done }));
    };

    onError = key => {
        const { done } = this.state.collection.next(key);

        console.error(`Error loading image: ${key}`);
        this.setState(() => ({ done }));
    };
}

export { GalleryItems as default, emptyData };
