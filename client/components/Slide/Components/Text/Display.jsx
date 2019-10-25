import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';

const Display = ({ html: __html }) => (
    <React.Fragment>
        <div
            dangerouslySetInnerHTML={{
                __html
            }}
        ></div>
    </React.Fragment>
);

Display.propTypes = {
    html: PropTypes.string.isRequired,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
