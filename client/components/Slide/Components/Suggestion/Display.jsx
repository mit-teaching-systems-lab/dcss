import { type } from './meta';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Icon, Message } from 'semantic-ui-react';
import RichTextEditor from '@components/RichTextEditor';
import 'suneditor/dist/css/suneditor.min.css';
import 'katex/dist/katex.min.css';

class Display extends React.Component {
  constructor(props) {
    super(props);

    const { color, html, open = false } = this.props;

    this.state = {
      color,
      html,
      open
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  render() {
    const { color, html, open } = this.state;
    const { onClick } = this;
    const props = open ? {} : { hidden: true };
    return (
      <Container style={{ margin: '1rem 0 1rem 0' }}>
        <Button onClick={onClick} compact inverted circular icon color={color}>
          <Icon name="info circle" />
          Information
        </Button>
        <Message color={color} {...props}>
          <RichTextEditor mode="display" defaultValue={html} />
        </Message>
      </Container>
    );
  }
}

Display.propTypes = {
  color: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
  open: PropTypes.bool,
  type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
