import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

const Loading = ({ size = 'medium', children }) => {
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

                {children ? children : <Image src={src} />}
            </Segment>
        </div>
    );
};

Loading.propTypes = {
    children: PropTypes.array,
    size: PropTypes.string
};
export default Loading;
