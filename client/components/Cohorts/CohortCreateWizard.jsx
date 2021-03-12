import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Step } from '@components/UI';
import { setCohort } from '@actions/cohort';
import { getUser } from '@actions/user';
import CohortCreateNewForm from './CohortCreateNewForm';
import CohortScenariosSelector from './CohortScenariosSelector';
import CohortShare from './CohortShare';
import '../ScenariosList/ScenariosList.css';
import Identity from '@utils/Identity';

export class CohortCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      step: 0
    };

    this.onCancel = this.onCancel.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  componentDidMount() {
    if (!this.props.user.id) {
      this.props.history.push('/logout');
    }
  }

  onCancel() {
    if (this.state.id) {
      // This operation is async, however it is unnecessary
      // to wait for it to complete
      this.props.setCohort(this.state.id, {
        deleted_at: new Date().toISOString()
      });
    }

    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  async onContinue(cohort) {
    const { id } = cohort;
    const { step } = this.state;

    await this.props.setCohort(id, cohort);

    // Step & Operation
    //
    // 0 : Create a new cohort with "this.state.name", on success set step to 1
    // 1 : Save scenario id list to cohort with "this.state.id", on success set step to 2
    // 2 : Send list of invitees to server to receive shared link.
    //

    // Continuing from step 2 means moving on to the cohort itself.
    if (step === 2) {
      this.props.history.push(`/cohort/${Identity.toHash(id)}`);
    } else {
      this.setState({
        id,
        step: step + 1
      });
    }
  }

  render() {
    const { id, step } = this.state;
    const { onCancel, onContinue } = this;
    const stepsProps = [{}, {}, {}];

    stepsProps[step].active = true;

    const stepGroup = (
      <Step.Group size="tiny" widths={stepsProps.length}>
        <Step {...stepsProps[0]}>
          <Icon name="group" />
          <Step.Content>
            <Step.Title>Name your cohort</Step.Title>
          </Step.Content>
        </Step>
        <Step {...stepsProps[1]}>
          <Icon name="newspaper outline" />
          <Step.Content>
            <Step.Title>Choose scenarios</Step.Title>
          </Step.Content>
        </Step>
        <Step {...stepsProps[2]}>
          <Icon name="share" />
          <Step.Content>
            <Step.Title>Share it!</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    );

    const primaryButtonContent =
      step === 0
        ? 'Create and continue'
        : step === 1
        ? 'Save and continue'
        : 'Go to cohort';

    const props = {
      header: 'Create a cohort',
      stepGroup,
      buttons: {
        primary: {
          content: primaryButtonContent,
          onClick: onContinue
        },
        secondary: {
          content: 'Cancel',
          onClick: onCancel
        }
      }
    };

    if (id) {
      props.id = id;
    }

    return (
      <Fragment>
        {step === 0 ? <CohortCreateNewForm {...props} /> : null}
        {step === 1 ? <CohortScenariosSelector {...props} /> : null}
        {step === 2 ? <CohortShare {...props} /> : null}
        <div data-testid="cohort-create-wizard" />
      </Fragment>
    );
  }
}

CohortCreate.propTypes = {
  setCohort: PropTypes.func,
  getUser: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = dispatch => ({
  setCohort: (id, params) => dispatch(setCohort(id, params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortCreate)
);
