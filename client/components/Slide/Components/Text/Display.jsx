import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

const Display = ({ html: __html }) => (
    <Container text>
        <div
            dangerouslySetInnerHTML={{
                __html
            }}
        ></div>
    </Container>
);

Display.propTypes = {
    html: PropTypes.string.isRequired,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
