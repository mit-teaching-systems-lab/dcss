import { type } from './meta';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { connect } from 'react-redux';
import { Button, Header, List, Segment } from '@components/UI';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import { getResponse } from '@actions/response';

class Display extends Component {
  constructor(props) {
    super(props);

    const { persisted = { value: '' } } = this.props;

    this.state = {
      value: persisted.value
    };

    this.created_at = new Date().toISOString();
    this.onClick = this.onClick.bind(this);
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    let { getResponse, persisted = {}, responseId, run } = this.props;

    let { value = '' } = persisted;

    if (!value && run.id) {
      const previous = await getResponse({
        id: run.id,
        responseId
      });

      if (previous && previous.response) {
        value = previous.response.value;
      }
    }

    if (value) {
      this.setState({ value });
    }
  }

  onClick(event, { name, value, content }) {
    if (!this.isScenarioRun) {
      event.stopPropagation();
    }

    const { created_at } = this;
    const { onResponseChange, recallId } = this.props;

    onResponseChange(event, {
      hasOwnNavigation: true,
      content,
      created_at,
      ended_at: new Date().toISOString(),
      name,
      recallId,
      type,
      value
    });

    this.setState({ value });
  }

  render() {
    const { paths, prompt, recallId, responseId, run } = this.props;
    const { value: previousValue } = this.state;
    const { onClick } = this;
    return paths && paths.length ? (
      <Segment>
        {prompt ? <Header as="h3" tabIndex="0">{prompt}</Header> : null}
        {recallId ? <ResponseRecall run={run} recallId={recallId} /> : null}

        <List>
          {paths.map((path, index) => {
            const { display, value } = path;
            const selectedIcon =
              previousValue === value ? { icon: 'checkmark' } : {};
            const key = Identity.key({ path, index });
            return (
              <List.Item key={`list-item-${key}`}>
                <Button
                  fluid
                  color="green"
                  content={display}
                  name={responseId}
                  value={value}
                  onClick={onClick}
                  {...selectedIcon}
                />
              </List.Item>
            );
          })}
        </List>
      </Segment>
    ) : null;
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  asSVG: PropTypes.bool,
  cohort: PropTypes.object,
  paths: PropTypes.array,
  getResponse: PropTypes.func,
  // match: PropTypes.shape({
  //   path: PropTypes.string,
  //   params: PropTypes.object
  // }).isRequired,
  onResponseChange: PropTypes.func,
  persisted: PropTypes.object,
  prompt: PropTypes.string,
  recallId: PropTypes.string,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  scenario: PropTypes.object,
  type: PropTypes.oneOf([type]).isRequired
};

const mapStateToProps = state => {
  const { cohort, run, scenario } = state;
  return { cohort, run, scenario };
};

const mapDispatchToProps = dispatch => ({
  getResponse: params => dispatch(getResponse(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);
