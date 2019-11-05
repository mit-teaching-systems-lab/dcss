import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

const DescriptionSlide = ({ title, description }, cardClass, SlideButton) => {
    return (
        <Card id="meta" key="meta" centered className={cardClass}>
            <Card.Header as="h2">{title}</Card.Header>
            <Card.Content>
                {description}
                {SlideButton}
            </Card.Content>
        </Card>
    );
};

DescriptionSlide.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
};

export default DescriptionSlide;
