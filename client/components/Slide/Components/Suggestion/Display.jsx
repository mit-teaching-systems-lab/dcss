import { type } from './meta';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Icon, Message } from '@components/UI';
import RichTextEditor from '@components/RichTextEditor';

class Display extends React.Component {
  constructor(props) {
    super(props);

    const { open = false } = this.props;

    this.state = {
      open
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  render() {
    const { color, html } = this.props;
    const { open } = this.state;
    const { onClick } = this;
    const icon = <Icon name="info circle" />;
    const content = open ? (
      <RichTextEditor mode="display" defaultValue={html} />
    ) : (
      <>{icon} Information</>
    );

    const onDismiss = onClick;
    const props = open
      ? { color, content, onDismiss }
      : { color, content, onClick };

    return (
      <Container style={{ margin: '1rem 0 1rem 0' }}>
        {open ? <Message {...props} /> : <Button icon {...props} />}
      </Container>
    );
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  color: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
  open: PropTypes.bool,
  type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
