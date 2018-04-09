import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import List from 'src/components/List';
import Thumbnail from './thumbnail';
import defaultClasses from './thumbnailList.css';

const getItemKey = ({ id }) => id;

class ThumbnailList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.oneOfType([
            PropTypes.instanceOf(Map),
            PropTypes.arrayOf(PropTypes.object)
        ])
    };

    render() {
        return (
            <List
                {...this.props}
                getItemKey={getItemKey}
                renderItem={Thumbnail}
                onSelectionChange={this.handleSelectionChange}
            />
        );
    }

    handleSelectionChange = selection => {
        const { onSelectionChange } = this.props;

        if (onSelectionChange) {
            onSelectionChange(selection);
        }
    };
}

export default classify(defaultClasses)(ThumbnailList);
