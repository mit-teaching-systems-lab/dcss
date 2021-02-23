import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Message } from '@components/UI';
import withTransition from './withTransition';

const icons = {
  info: 'announcement',
  success: 'checkmark',
  error: 'remove',
  warning: 'warning circle'
};

function Toast(props) {
  const {
    className = '',
    description,
    title,
    /* style = {}, */ ...rest
  } = props;

  const onDismiss = e => {
    e.stopPropagation();
    rest.onDismiss();
    rest.onClose();
  };

  const icon = rest.icon || icons[rest.type];
  const header = title || null;
  const content = (
    <Fragment>
      {header ? (
        <Header size="small">
          {icon ? <Icon className={icon} /> : null}
          <Header.Content>{header}</Header.Content>
        </Header>
      ) : null}
      {description || null}
    </Fragment>
  );

  const type = rest.type ? { [rest.type]: true } : {};
  const floating = true;
  const messageProps = {
    ...rest,
    ...type,
    onDismiss,
    content,
    floating
  };

  // This is in the header
  delete messageProps.icon;

  return (
    <div className={className}>
      <Message {...messageProps} />
    </div>
  );
}

Toast.propTypes = {
  className: PropTypes.string,
  description: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.node
  ]),
  icon: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onDismiss: PropTypes.func,
  onClose: PropTypes.func,
  style: PropTypes.object,
  type: PropTypes.string,
  title: PropTypes.node
};

Toast.defaultProps = {
  onDismiss: () => undefined,
  onClose: () => undefined,
  icon: undefined
};

export default withTransition(Toast);
