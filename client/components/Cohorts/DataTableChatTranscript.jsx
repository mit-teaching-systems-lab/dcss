import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Username from '@components/User/Username';
import Identity from '@utils/Identity';

const DataTableChatTranscript = props => {
  const { transcript, usersById } = props;

  return transcript && transcript.length ? (
    transcript.map(message => {
      const author = usersById[message.user_id];
      return (
        <p key={Identity.key(message)}>
          <Username user={author} />: {message.textContent}
        </p>
      );
    })
  ) : (
    <Fragment>No chat messages available</Fragment>
  );
};

DataTableChatTranscript.propTypes = {
  transcript: PropTypes.array,
  usersById: PropTypes.object
};

export default DataTableChatTranscript;
