import { type } from './meta';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import { connect } from 'react-redux';
import { Button, Header, List, Segment } from '@components/UI';
import PromptRequiredLabel from '../PromptRequiredLabel';
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

  onClick(event, { name, value }) {
    if (!this.isScenarioRun) {
      event.stopPropagation();
    }

    const { created_at } = this;
    const { onResponseChange, recallId } = this.props;

    onResponseChange(event, {
      hasOwnNavigation: true,
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
    const { paths, prompt, recallId, required, responseId, run } = this.props;
    const { value, value: previousValue } = this.state;
    const { onClick } = this;
    // const fulfilled = value ? true : false;
    const header = (
      <React.Fragment>
        {prompt} {required && <PromptRequiredLabel fulfilled={false} />}
      </React.Fragment>
    );

    return paths && paths.length ? (
      <Segment>
        <Header as="h3">{header}</Header>
        {recallId && <ResponseRecall run={run} recallId={recallId} />}

        <List>
          {paths.map(path => {
            const { display, value } = path;
            const selectedIcon =
              previousValue === value ? { icon: 'checkmark' } : {};

            return (
              <List.Item key={hash(path)}>
                <Button
                  fluid
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
