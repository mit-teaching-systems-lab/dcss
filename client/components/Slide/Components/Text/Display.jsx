import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import './Text.css';

const Display = ({ html: __html }) => (
    <React.Fragment>
        <div
            className="richtext__container"
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
