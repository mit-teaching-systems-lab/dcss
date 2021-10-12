import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Username from '@components/User/Username';
import Identity from '@utils/Identity';

const DataTableChatTranscript = props => {
  const { omitJoinPart = false, transcript, usersById } = props;

  return transcript && transcript.length ? (
    transcript.reduce((accum, message) => {
      const author = usersById[message.user_id];
      const __html = message.content;

      if (omitJoinPart && message.is_joinpart) {
        return accum;
      }

      accum.push(
        <p key={Identity.key(message)}>
          <Username user={author} />:
          <span dangerouslySetInnerHTML={{ __html }} />
        </p>
      );
      return accum;
    }, [])
  ) : (
    <Fragment>No chat messages available</Fragment>
  );
};

DataTableChatTranscript.propTypes = {
  omitJoinPart: PropTypes.bool,
  transcript: PropTypes.array,
  usersById: PropTypes.object
};

export default DataTableChatTranscript;
