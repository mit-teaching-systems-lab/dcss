import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Dimmer,
  Image,
  Loader,
  Placeholder,
  Segment
} from 'semantic-ui-react';
import './Loading.css';
const Loading = ({
  card = { cols: 1, rows: 1 },
  size = 'medium',
  children
}) => {
  const src =
    size === 'mini' || size === 'small'
      ? '/images/wireframe/short-paragraph.png'
      : '/images/wireframe/paragraph.png';

  if (card) {
    let counter = 0;
    let isSingleCard = card.cols === 1 && card.rows === 1;
    let singleCardStyle = {
      width: '100%',
      height: '100%'
    };
    let style = isSingleCard
      ? { ...singleCardStyle, ...(card.style || {}) }
      : { ...(card.style || {}) };

    // <Placeholder.Paragraph>
    //   <Placeholder.Line length='medium' />
    //   <Placeholder.Line length='short' />
    // </Placeholder.Paragraph>

    return isSingleCard ? (
      <Card
        className="loading__single-card"
        style={style}
        key={`placeholder-${counter++}`}
      >
        <Card.Content>
          <Placeholder>
            <Placeholder.Image rectangular />
          </Placeholder>
        </Card.Content>
      </Card>
    ) : (
      <Card.Group style={style} itemsPerRow={card.cols}>
        {Array.from({ length: card.cols * card.rows }, (_, index) => (
          <Card key={`placeholder-${index}-${counter++}`}>
            <Card.Content>
              <Placeholder>
                <Placeholder.Image rectangular />
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
  children: PropTypes.array,
  size: PropTypes.string
};
export default Loading;
