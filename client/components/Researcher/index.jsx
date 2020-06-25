import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'json2csv';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Icon,
  Pagination,
  Popup,
  Table
} from '@components/UI';
import hash from 'object-hash';
import { getCohorts } from '@actions/cohort';
import { getScenarios, getScenarioRunHistory } from '@actions/scenario';
import { getUser } from '@actions/user';
import CSV from '@utils/csv';
import { makeHeader } from '@utils/data-table';
import Loading from '@components/Loading';
import '../Cohorts/Cohort.css';
import './Researcher.css';

const ROWS_PER_PAGE = 10;

function isAudioFile(input) {
  return /^audio\/\d.+\/AudioResponse/.test(input) && input.endsWith('.mp3');
}

class Researcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      activePage: 1,
      scenario: null,
      cohort: null
    };
    // This is disabled for Jamboree.
    // this.onCohortSelect = this.onCohortSelect.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onScenarioDataClick = this.onScenarioDataClick.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      await this.props.getScenarios();
      await this.props.getCohorts();
      this.setState({ isReady: true });
    }
  }

  // This is disabled for Jamboree.
  // onCohortSelect(event, data) {
  //     console.log(data);
  //     // this.setState()
  // }

  onPageChange(event, { activePage }) {
    this.setState({
      activePage
    });
  }

  async onScenarioDataClick(event, data) {
    const { getScenarioRunHistory } = this.props;
    const { scenario, cohort } = data;

    const { id: scenarioId } = scenario;
    const { id: cohortId } = cohort;
    const { prompts, responses } = await getScenarioRunHistory({
      scenarioId,
      cohortId
    });
    const records = responses.flat();

    records.forEach(record => {
      const { is_skip, response_id, transcript, value } = record;
      const prompt = prompts.find(prompt => prompt.responseId === response_id);
      record.header = makeHeader(prompt, prompts);
      record.content = is_skip ? '(skipped)' : transcript || value;

      if (isAudioFile(value)) {
        record.content += ` (${location.origin}/api/media/${value})`;
      }

      record.cohort_id = cohort.id;
    });

    const fields = [
      'username',
      'header',
      'content',
      'is_skip',
      'run_id',
      'created_at',
      'ended_at',
      'type',
      'referrer_params',
      'cohort_id'
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    CSV.download(hash({cohort, scenario}), csv);
  }

  render() {
    const { onPageChange, onScenarioDataClick } = this;
    const { activePage, isReady } = this.state;
    const { cohorts, scenariosById, user } = this.props;

    if (!isReady) {
      return <Loading />;
    }

    const hasAccessToCohort = cohort => {
      return cohort.users.find(({ id, roles }) => {
        return id === user.id && roles.includes('researcher');
      });
    };

    const downloads = cohorts.reduce((accum, cohort) => {
      if (hasAccessToCohort(cohort)) {
        accum.push(
          ...cohort.scenarios.map(id => {
            const scenario = scenariosById[id];
            const { title } = scenario;

            return (
              <Table.Row key={hash({ ...cohort, id, title })}>
                <Table.Cell verticalAlign="top" collapsing>
                  <ResearcherMenu
                    cohort={cohort}
                    scenario={scenario}
                    onClick={onScenarioDataClick}
                  />
                </Table.Cell>
                <Table.Cell verticalAlign="top">{cohort.name}</Table.Cell>
                <Table.Cell verticalAlign="top">{title}</Table.Cell>
              </Table.Row>
            );
          })
        );
      }
      return accum;
    }, []);

    const downloadsPages = Math.ceil(downloads.length / ROWS_PER_PAGE);
    const downloadsIndex = (activePage - 1) * ROWS_PER_PAGE;
    const downloadsSlice = downloads.slice(
      downloadsIndex,
      downloadsIndex + ROWS_PER_PAGE
    );

    return (
      <div>
        <Table role="grid" unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="4">
                Research: Download Scenario Run Data
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing></Table.HeaderCell>
              <Table.HeaderCell style={{width:'30%'}}>Cohort</Table.HeaderCell>
              <Table.HeaderCell >Scenario</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{downloadsSlice}</Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="4">
                {downloadsPages > 1 ? (
                  <Pagination
                    name="downloads"
                    siblingRange={1}
                    boundaryRange={0}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    activePage={activePage}
                    onPageChange={onPageChange}
                    totalPages={downloadsPages}
                  />
                ) : null}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    );
  }
}

const ResearcherMenu = props => {
  const { onClick, cohort, scenario } = props;

  const onClickToDownloadData = (event, props) => {
    onClick(event, {
      ...props,
      cohort,
      scenario
    });
  };
  return (
    <Button.Group hidden basic size="tiny" className="buttongroup__transparent">
      <Popup
        content="Download all data from this scenario"
        trigger={
          <Button
            icon
            content={<Icon name="download" />}
            name="scenario"
            onClick={onClickToDownloadData}
          />
        }
      />
    </Button.Group>
  );
};

ResearcherMenu.propTypes = {
  cohort: PropTypes.object,
  scenario: PropTypes.object,
  onClick: PropTypes.func
};

Researcher.propTypes = {
  cohorts: PropTypes.array,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  runs: PropTypes.array,
  scenarios: PropTypes.array,
  scenariosById: PropTypes.object,
  getCohorts: PropTypes.func,
  getScenarios: PropTypes.func,
  getScenarioRunHistory: PropTypes.func,
  getUser: PropTypes.func,
  onClick: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { cohorts, runs, scenarios, scenariosById, user } = state;
  return { cohorts, runs, scenarios, scenariosById, user };
};

const mapDispatchToProps = dispatch => ({
  getCohorts: () => dispatch(getCohorts()),
  getScenarios: () => dispatch(getScenarios()),
  getScenarioRunHistory: params => dispatch(getScenarioRunHistory(params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Researcher)
);
