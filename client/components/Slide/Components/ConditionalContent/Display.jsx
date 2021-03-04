import { type } from './meta';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Icon, Message } from '@components/UI';
import RichTextEditor from '@components/RichTextEditor';
import { SUGGESTION_CLOSE, SUGGESTION_OPEN } from '@hoc/withRunEventCapturing';

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
    const { color, html, id, type } = this.props;
    const { open } = this.state;

    const which = open ? SUGGESTION_CLOSE : SUGGESTION_OPEN;

    this.props.saveRunEvent(which, {
      component: {
        color,
        html,
        id,
        type
      }
    });

    this.setState({ open: !open });
  }

  render() {
    const { color, html } = this.props;
    const { open } = this.state;
    const { onClick, onClick: onDismiss } = this;
    const icon = <Icon name="info circle" />;
    const content = open ? (
      <RichTextEditor mode="display" defaultValue={html} />
    ) : (
      <>{icon} Information</>
    );

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
  id: PropTypes.string,
  rules: PropTypes.array,
  component: PropTypes.object,
  saveRunEvent: PropTypes.func,
  type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
