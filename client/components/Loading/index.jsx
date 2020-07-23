import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Dimmer,
  Image,
  Loader,
  Placeholder,
  Segment
} from '@components/UI';
import './Loading.css';

const resolveProps = (props, defaults) => {
  Object.entries(defaults).forEach(([key, val]) => {
    if (!props[key]) {
      props[key] = val;
    }
  });
  return props;
};

const defaultCardProps = {
  cols: 1,
  rows: 1,
  style: {},
  content: { style: {} }
};
const defaultGroupProps = { style: {} };

const Loading = ({ card = {}, group = {}, size = 'medium', children }) => {
  const src =
    size === 'mini' || size === 'small'
      ? '/images/wireframe/short-paragraph.png'
      : '/images/wireframe/paragraph.png';

  resolveProps(card, defaultCardProps);
  resolveProps(group, defaultGroupProps);

  if (card) {
    let counter = 0;
    let groupStyle = { ...(group.style || {}) };

    let isSingleCard = card.cols === 1 && card.rows === 1;
    let singleCardStyle = {
      width: '100%',
      height: '90%'
    };
    let cardStyle = isSingleCard
      ? { ...singleCardStyle, ...(card.style || {}) }
      : { ...(card.style || {}) };

    let cardContentStyle = {
      ...((card.content && card.content.style) || {})
    };

    return isSingleCard ? (
      <Card
        className="loading__single-card"
        style={cardStyle}
        key={`placeholder-${counter++}`}
      >
        <Card.Content className="loading__content" style={cardContentStyle}>
          <Placeholder>
            <Placeholder.Image square />
          </Placeholder>
        </Card.Content>
      </Card>
    ) : (
      <Card.Group style={groupStyle} itemsPerRow={card.cols}>
        {Array.from({ length: card.cols * card.rows }, (_, index) => (
          <Card key={`placeholder-${index}-${counter++}`} style={cardStyle}>
            <Card.Content className="loading__content" style={cardContentStyle}>
              <Placeholder>
                <Placeholder.Image square />
              </Placeholder>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    );
  }

  return (
    <div style={{ marginBottom: '1em' }}>
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
  card: PropTypes.object,
  group: PropTypes.object,
  children: PropTypes.array,
  size: PropTypes.string
};
export default Loading;
