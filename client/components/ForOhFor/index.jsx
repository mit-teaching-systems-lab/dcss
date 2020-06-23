import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

function ForOhFor({ history }) {
  history.push('/scenarios');
  return null;
}

ForOhFor.propTypes = {
  history: PropTypes.object
};

export default withRouter(ForOhFor);
