import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

const Loading = ({ size = 'medium' }) => {
    const src =
        size === 'mini' || size === 'small'
            ? '/images/wireframe/short-paragraph.png'
            : '/images/wireframe/paragraph.png';

    return (
        <div>
            <Segment>
                <Dimmer active inverted>
                    <Loader size={size}>Loading</Loader>
                </Dimmer>

                <Image src={src} />
            </Segment>
        </div>
    );
};

Loading.propTypes = {
    size: PropTypes.string
};
export default Loading;
