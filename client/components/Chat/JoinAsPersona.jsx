import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import JoinAsButton from '@components/Chat/JoinAsButton.jsx';
import ScenarioPersonaEditor from '@components/ScenarioEditor/ScenarioPersonaEditor';
import { Button, Form, Icon, Text } from '@components/UI';
import Identity from '@utils/Identity';
import Partnering from '@utils/Partnering';

import '@components/ScenarioEditor/ScenarioPersonas.css';

class JoinAsPersona extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      personaEditor: {
        isOpen: false,
        persona: null
      }
    };
    this.onRoomAccessChange = this.onRoomAccessChange.bind(this);
  }

  onRoomAccessChange(event) {
    const { value } = event.target;
    const isOpen = value === 'yes';
    this.setState({
      isOpen
    });
  }

  render() {
    const { cohort, onClick, scenario } = this.props;
    const { personaEditor } = this.state;
    const { onRoomAccessChange } = this;

    // Check if facilitator set this scenario to BOTH, CLOSED or OPEN
    const partnering = cohort.partnering[scenario.id];
    const isUserChoice = partnering === Partnering.BOTH;
    const isOpen = isUserChoice
      ? this.state.isOpen
      : partnering === Partnering.OPEN;

    // TODO: make available to facilitator?
    const owner = cohort.users.find(({ is_owner }) => is_owner);
    const isUserAllowedToEditCohort = owner.id === this.props.user.id;
    const scenarioPersonaEditorProps = personaEditor.isOpen
      ? {
        persona: personaEditor.persona,
        onCancel: () => {
          this.setState({
            personaEditor: {
              isOpen: false,
              persona: null
            }
          });
        }
      }
      : null;

    return (
      <Fragment>
        {cohort.partnering[scenario.id] === Partnering.BOTH ? (
          <Fragment>
            <p tabIndex="0">How do you want to partner?</p>
            <Form>
              <Form.Field>
                <div className="ui checked radio checkbox">
                  <input
                    data-testid="roomaccess"
                    tabIndex="0"
                    type="radio"
                    name="isOpen"
                    id="yes"
                    value="yes"
                    checked={isOpen === true}
                    onChange={onRoomAccessChange}
                  />
                  <label htmlFor="yes">Let anyone in my cohort join.</label>
                </div>
              </Form.Field>

              <Form.Field>
                <div className="ui checked radio checkbox">
                  <input
                    data-testid="roomaccess"
                    tabIndex="0"
                    type="radio"
                    name="isOpen"
                    id="no"
                    value="no"
                    checked={isOpen === false}
                    onChange={onRoomAccessChange}
                  />
                  <label htmlFor="no">I will invite participants.</label>
                </div>
              </Form.Field>
            </Form>
          </Fragment>
        ) : null}
        {scenario.personas.map(persona => {
          const editPersonaButton = isUserAllowedToEditCohort ? (
            <Button
              aria-label="Edit persona"
              className="sc__button sc__hidden-on-mobile"
              floated="right"
              size="tiny"
              data-testid="open-persona-editor"
              onClick={() => {
                this.setState({
                  personaEditor: {
                    isOpen: true,
                    persona
                  }
                });
              }}
            >
              <Icon name="edit outline" className="primary" />
              <span className="sc__card-action-labels">Edit</span>
            </Button>
          ) : null;

          return (
            <Fragment key={Identity.key(persona)}>
              <div>
                <JoinAsButton
                  className="c__join-persona-button"
                  cohort={cohort}
                  isOpen={isOpen}
                  persona={persona}
                  scenario={scenario}
                  onClick={onClick}
                />
              </div>
              <div>
                {/* <p>
                  <strong>{persona.name}</strong>
                </p> */}
                {persona.description !== persona.name ? (
                  <Text>{persona.description}</Text>
                ) : null}
                {/* {editPersonaButton} */}
              </div>
            </Fragment>
          );
        })}

        {personaEditor.isOpen ? (
          <ScenarioPersonaEditor {...scenarioPersonaEditorProps} />
        ) : null}
      </Fragment>
    );
  }
}

JoinAsPersona.propTypes = {
  onClick: PropTypes.func,
  cohort: PropTypes.object,
  scenario: PropTypes.object,
  socket: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (_state, ownProps) => {
  const { cohort, scenario, user } = ownProps;
  return { cohort, scenario, user };
};

export default connect(
  mapStateToProps,
  null
)(JoinAsPersona);
