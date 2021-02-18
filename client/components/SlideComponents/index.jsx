import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Components from '@components/Slide/Components';
import Storage from '@utils/Storage';

const SlideComponents = props => {
  const {
    asSVG = false,
    components,
    onResponseChange,
    persona,
    run,
    saveRunEvent
  } = props;
  const emptyValue = { value: '' };
  const componentDisplayProps = run ? { run } : {};
  const outerStyle = {
    height: '100px',
    overflow: 'hidden',
    margin: '-1rem !important'
  };
  const transform = 'scale(0.3)';
  const width = '100%';
  const height = '100%';

  return asSVG ? (
    <div style={outerStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="1000">
        {/* intentionally break out */}
        <foreignObject transform={transform} width={width} height={height}>
          <section>
            {/*
            Only the first three components
            will be rendered. This prevents
            the UI from getting sluggish for
            the sake of rendering these
            entirely non-functional version.
          */}
            {components.slice(0, 3).map((value, index) => {
              const { type } = value;
              if (!Components[type]) return;
              const { Display } = Components[type];
              return (
                <Display
                  isEmbeddedInSVG={true}
                  key={`component-svg-${index}`}
                  persisted={{}}
                  {...value}
                />
              );
            })}
          </section>
        </foreignObject>
        <rect
          x="0"
          y="0"
          fill="transparent"
          transform={transform}
          width={width}
          height={height}
        />
      </svg>
    </div>
  ) : (
    components.reduce((accum, component, index) => {
      const { type, responseId = null } = component;
      if (!Components[type]) {
        return accum;
      }
      // If there is a persona assigned to this component,
      // and it does not match the user's current role, do
      // not render the component. Personas will not be checked
      // in non-run renders.
      if (persona && component.persona && component.persona.id !== persona.id) {
        return accum;
      }

      const { Display } = Components[type];
      const persisted = run
        ? Storage.get(`run/${run.id}/${responseId}`, emptyValue)
        : emptyValue;

      const saveRunEventWithComponent = (name, context) => {
        saveRunEvent.call(props, name, {
          ...context,
          component
        });
      };

      accum.push(
        <Display
          key={`component-html-${index}`}
          persisted={persisted}
          onResponseChange={onResponseChange}
          saveRunEvent={saveRunEventWithComponent}
          {...componentDisplayProps}
          {...component}
        />
      );

      return accum;
    }, [])
  );
};

SlideComponents.propTypes = {
  asSVG: PropTypes.bool,
  chat: PropTypes.object,
  components: PropTypes.array,
  onResponseChange: PropTypes.func,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  persona: PropTypes.object,
  scenario: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const chat = ownProps.chat || state.chat;
  const run = location.href.includes('run/') && (ownProps.run || state.run);
  const scenario = ownProps.scenario || state.scenario;
  const user = ownProps.user || state.user;
  const inActiveRun = run && run.id && !run.ended_at;
  const inActiveChat = chat && chat.id && !chat.ended_at;
  let persona = null;

  if (inActiveRun && inActiveChat) {
    const id = chat.usersById[user.id].persona_id;
    persona = scenario.personas.find(persona => persona.id === id);
  }

  return { persona, scenario, user };
};

export default connect(
  mapStateToProps,
  null
)(SlideComponents);
