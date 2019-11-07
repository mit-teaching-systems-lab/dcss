import { type } from './type';
import React from 'react';
import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Display = ({ color, html: __html }) => (
    <Message color={color}>
        <div
            dangerouslySetInnerHTML={{
                __html
            }}
        ></div>
    </Message>
);

Display.propTypes = {
    color: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
