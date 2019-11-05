import React from 'react';
import { Card } from 'semantic-ui-react';

import SlideComponentsList from '@components/SlideComponentsList';

const ContentSlide = (slide, cardClass, SlideButton) => {
    return (
        <Card id={slide.id} key={slide.id} centered className={cardClass}>
            <Card.Header as="h3" key={`header${slide.id}`}>
                {slide.title}
            </Card.Header>
            <Card.Content key={`content${slide.id}`}>
                <SlideComponentsList components={slide.components} />
                {SlideButton}
            </Card.Content>
        </Card>
    );
};

export default ContentSlide;
