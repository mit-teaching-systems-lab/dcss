import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveRunEvent } from '@actions/run';
export * from '@server/service/runs/event-types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function(Component) {
  function WithRunEventCapturing(props) {
    return <Component {...props} />;
  }

  WithRunEventCapturing.displayName = `WithRunEventCapturing(${getDisplayName(
    Component
  )})`;

  WithRunEventCapturing.propTypes = {
    saveRunEvent: PropTypes.func,
    run: PropTypes.object
  };

  const mapStateToProps = state => {
    const { run } = state;
    return { run };
  };

  const mapDispatchToProps = dispatch => ({
    saveRunEvent(event, context) {
      if (location.pathname.includes('/run/')) {
        // this === this.props
        // eslint-disable-next-line no-console
        // console.log(event, context);
        dispatch(saveRunEvent(this.run.id, event, context));
      }
    }
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WithRunEventCapturing);
}
