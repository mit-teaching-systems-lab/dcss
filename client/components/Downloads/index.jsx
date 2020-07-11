import React, { Component, Fragment } from 'react';
import hash from 'object-hash';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Parser } from 'json2csv';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Container,
  Dropdown,
  Icon,
  /*Input,*/
  Menu,
  Pagination,
  Table
} from '@components/UI';
import { getAllCohorts, getCohorts } from '@actions/cohort';
import { getHistoryForScenario } from '@actions/history';
import { getScenarios } from '@actions/scenario';
import { getUser } from '@actions/user';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import CSV from '@utils/csv';
import { makeHeader } from '@utils/data-table';
import shorten from '@utils/shorten';
import '../Cohorts/Cohort.css';
import '../Cohorts/DataTable.css';
import './Downloads.css';

const ROWS_PER_PAGE = 10;

function isAudioFile(input) {
  return /^audio\/\d.+\/AudioResponse/.test(input) && input.endsWith('.mp3');
}

class Downloads extends Component {
  constructor(props) {
    super(props);

    const { activePage, filter } = this.props;

    this.state = {
      isReady: false,
      activePage: activePage || 1,
      filter
    };
    this.onDownloadSearchChange = this.onDownloadSearchChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.requestDownload = this.requestDownload.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      await this.props.getScenarios();

      if (this.props.user.is_super) {
        await this.props.getAllCohorts();
      } else {
        await this.props.getCohorts();
      }

      this.setState({ isReady: true });
    }
  }

  onDownloadSearchChange(options, query) {
    const re = new RegExp(_.escapeRegExp(query));
    return options.filter(option => re.test(option.text));
  }

  onPageChange(event, { activePage }) {
    this.props.history.push(`/downloads/${activePage}`);
    this.setState({
      activePage
    });
  }

  async requestDownload({ cohort, scenarioId }) {
    const { getHistoryForScenario } = this.props;
    const scenarioIds = scenarioId
      ? [scenarioId]
      : cohort.scenarios.map(v => (typeof v === 'number' ? v : v.id));
    const files = [];

    for (let id of scenarioIds) {
      const { prompts, responses } = await getHistoryForScenario(
        id,
        cohort && cohort.id
      );

      const records = responses.flat();
      records.forEach(record => {
        const {
          is_skip,
          response_id,
          response: { content },
          transcript,
          value
        } = record;
        const prompt = prompts.find(
          prompt => prompt.responseId === response_id
        );
        record.header = makeHeader(prompt, prompts);
        record.content = content || '';
        record.content += is_skip ? '(skipped)' : ` ${transcript || value}`;

        if (isAudioFile(value)) {
          record.content += ` (${location.origin}/api/media/${value})`;
        }

        if (cohort) {
          record.cohort_id = cohort.id;
        }
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
        'consent_granted_by_user'
      ];

      if (cohort) {
        fields.push('cohort_id');
      }

      const file = hash({ cohort, id });
      const parser = new Parser({ fields });
      const csv = parser.parse(records);

      files.push([`${file}.csv`, csv]);
    }

    if (Object.entries(files).length === 1) {
      const [file, csv] = files[0];
      CSV.download(file, csv);
    } else {
      CSV.downloadZipAsync(files);
    }
  }

  render() {
    const { onDownloadSearchChange, onPageChange, requestDownload } = this;
    const { activePage, filter, isReady } = this.state;
    const {
      cohorts,
      /*cohortsById, */ scenarios,
      scenariosById,
      user
    } = this.props;

    if (!isReady) {
      return <Loading />;
    }

    const hasAccessToCohort = cohort => {
      if (user.is_super) {
        return true;
      }
      return cohort.users.find(({ id, roles }) => {
        return id === user.id && roles.includes('researcher');
      });
    };

    const downloadZipIcon = (
      <Icon.Group size="big" className="ig__multiple-file">
        <Icon name="file archive outline" />
        <Icon name="download" corner="top right" color="green" />
      </Icon.Group>
    );

    const downloadRunIcon = (
      <Icon.Group>
        <Icon name="file alternate outline" />
        <Icon name="download" corner="top right" color="green" />
      </Icon.Group>
    );

    const dropdownCohortSelectOptions = [
      {
        key: -1,
        value: -1,
        text: 'Find cohort'
      }
    ];

    const downloads = cohorts.reduce((accum, cohort, index) => {
      if (hasAccessToCohort(cohort)) {
        const onDownloadByCohortClick = () => {
          requestDownload({ cohort });
        };

        dropdownCohortSelectOptions.push({
          key: hash({ cohort, index }),
          value: cohort.id,
          text: shorten(cohort.name, 50)
        });

        if (filter && (filter.type !== 'cohort' || filter.id !== cohort.id)) {
          return accum;
        }

        accum.push(
          ...cohort.scenarios.map((id, index) => {
            const scenario = scenariosById[id];
            const onDownloadByScenarioRunClick = () => {
              requestDownload({ cohort, scenarioId: id });
            };

            return (
              <Table.Row
                key={hash({ ...cohort, id })}
                created_at={Date.now(cohort.created_at)}
              >
                {index === 0 ? (
                  <Table.Cell.Clickable
                    verticalAlign="top"
                    popup="Download a zip containing csv files containing responses for all scenarios in this cohort"
                    rowSpan={cohort.scenarios.length}
                    content={downloadZipIcon}
                    onClick={onDownloadByCohortClick}
                  />
                ) : null}

                <Table.Cell.Clickable
                  verticalAlign="top"
                  popup="Download a csv file containing responses to only this scenario, from this cohort"
                  content={downloadRunIcon}
                  onClick={onDownloadByScenarioRunClick}
                />
                <Table.Cell
                  verticalAlign="top"
                  className="dtr__cell-fluid-half"
                >
                  {cohort.name}
                </Table.Cell>
                <Table.Cell verticalAlign="top" className="dt__cell-truncated">
                  {scenario.title}
                </Table.Cell>
              </Table.Row>
            );
          })
        );
      }
      return accum;
    }, []);

    dropdownCohortSelectOptions.sort((a, b) => {
      return a.text < b.text;
    });

    let dropdownScenarioSelectOptions = null;
    if (user.is_super) {
      dropdownScenarioSelectOptions = [
        {
          key: -1,
          value: -1,
          text: 'Find scenario'
        }
      ];

      const scenarioRunDownloads = scenarios.reduce(
        (accum, scenario, index) => {
          const onDownloadByScenarioRunClick = () => {
            requestDownload({ scenarioId: scenario.id });
          };

          dropdownScenarioSelectOptions.push({
            key: hash({ scenario, index }),
            value: scenario.id,
            text: shorten(scenario.title, 50)
          });

          if (
            filter &&
            (filter.type !== 'scenario' || filter.id !== scenario.id)
          ) {
            return accum;
          }

          accum.push(
            <Table.Row
              key={hash({ scenario })}
              created_at={Date.now(scenario.created_at)}
            >
              <Table.Cell style={{ minWidth: '47px' }}> </Table.Cell>
              <Table.Cell.Clickable
                verticalAlign="top"
                popup="Download a csv file containing responses to only this scenario"
                content={downloadRunIcon}
                onClick={onDownloadByScenarioRunClick}
              />
              <Table.Cell
                verticalAlign="top"
                className="dtr__cell-fluid-half dt__cell-data-missing"
              ></Table.Cell>
              <Table.Cell verticalAlign="top" className="dt__cell-truncated">
                {scenario.title}
              </Table.Cell>
            </Table.Row>
          );
          return accum;
        },
        []
      );

      dropdownScenarioSelectOptions.sort((a, b) => {
        return a.text < b.text;
      });

      downloads.push(...scenarioRunDownloads);
    }

    downloads.sort((a, b) => {
      return a.props.created_at > b.props.created_at;
    });

    const downloadsPages = Math.ceil(downloads.length / ROWS_PER_PAGE);
    const downloadsIndex = (activePage - 1) * ROWS_PER_PAGE;
    const downloadsSlice = downloads.slice(
      downloadsIndex,
      downloadsIndex + ROWS_PER_PAGE
    );
    const menuItemDownloadsCount = (
      <Menu.Item key="menu-item-downloads-count">
        <Icon.Group className="em__icon-group-margin">
          {downloadRunIcon.props.children}
        </Icon.Group>
        Downloads ({downloads.length})
      </Menu.Item>
    );

    /*
    let filterDisplay = null;
    if (filter) {
      filterDisplay =
        filter.type === 'cohort'
          ? cohortsById[filter.id].name
          : scenariosById[filter.id].title;
    }
    const menuItemFilterDisplay = filter ? (
      <Menu.Item key="menu-item-filter-display">
        <Icon.Group className="em__icon-group-margin">
          {downloadRunIcon.props.children}
        </Icon.Group>
        {shorten(filterDisplay, 50)}
      </Menu.Item>
    ) : null;
  */
    const pushFilterToHistory = ({ id, type }) => {
      if (id !== -1) {
        this.props.history.push(`/downloads/${type}/${id}`);
        this.setState({ filter: { type, id } });
      }
    };

    const menuItemCohortSelect = dropdownCohortSelectOptions ? (
      <Menu.Item key="menu-item-cohort-select" style={{ width: '30%' }}>
        <Dropdown
          fluid
          item
          selection
          scrolling
          placeholder="Select cohort"
          selectOnNavigation={false}
          defaultValue={-1}
          options={dropdownCohortSelectOptions}
          search={onDownloadSearchChange}
          onChange={(_, { value: id }) => {
            pushFilterToHistory({ id, type: 'cohort' });
          }}
        />
      </Menu.Item>
    ) : null;

    const menuItemScenarioSelect = dropdownScenarioSelectOptions ? (
      <Menu.Item key="menu-item-scenario-select" style={{ width: '30%' }}>
        <Dropdown
          fluid
          item
          selection
          scrolling
          placeholder="Select scenario"
          selectOnNavigation={false}
          defaultValue={-1}
          options={dropdownScenarioSelectOptions}
          search={onDownloadSearchChange}
          onChange={(_, { value: id }) => {
            pushFilterToHistory({ id, type: 'scenario' });
          }}
        />
      </Menu.Item>
    ) : null;

    /*
    const menuItemClearSelect = filter ? (
      <Menu.Item
        key="menu-item-clear-select"
        as={NavLink}
        exact
        to="/downloads/1"
      >
        <Icon name="x" /> Clear filter
      </Menu.Item>
    ) : null;
    const menuItemDownloadsSearch = (
      <Menu.Menu key="menu-item-downloads-search" position="right">
        <Menu.Item name="Search downloads">
          <Input
            icon="search"
            placeholder="Search..."
            onChange={onDownloadSearchChange}
          />
        </Menu.Item>
      </Menu.Menu>
    );
    */

    const menuBar = (
      <EditorMenu
        type="administration"
        items={{
          left: [
            // filter ? menuItemFilterDisplay : menuItemDownloadsCount,
            menuItemDownloadsCount
          ],
          right: [
            // menuItemCohortSelect,
            // menuItemScenarioSelect,
            // menuItemClearSelect,
            // menuItemDownloadsSearch
          ]
        }}
      />
    );

    const buttonProps = { compact: true, basic: true };
    if (!filter) {
      buttonProps.disabled = true;
    }

    return (
      <Fragment>
        {menuBar}
        <Container fluid>
          <Table role="grid" unstackable striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={2}>
                  <Button
                    {...buttonProps}
                    onClick={() => {
                      this.props.history.push('/downloads');
                      this.setState({ filter: null });
                    }}
                  >
                    <Icon.Group size="large">
                      <Icon name="filter" />
                      {filter ? (
                        <Icon corner="top right" name="x" color="red" />
                      ) : null}
                    </Icon.Group>
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell className="dtr__cell-fluid-half-th">
                  {menuItemCohortSelect.props.children}
                </Table.HeaderCell>
                <Table.HeaderCell className="dtr__cell-fluid-half-th">
                  {user.is_super
                    ? menuItemScenarioSelect.props.children
                    : 'Scenario'}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {downloadsSlice.length ? (
                downloadsSlice
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={100}>No downloads available.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
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
        </Container>
      </Fragment>
    );
  }
}

Downloads.propTypes = {
  activePage: PropTypes.node,
  cohorts: PropTypes.array,
  cohortsById: PropTypes.object,
  filter: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object
  }),
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node,
      type: PropTypes.string
    }).isRequired
  }).isRequired,
  scenarios: PropTypes.array,
  scenariosById: PropTypes.object,
  getAllCohorts: PropTypes.func,
  getCohorts: PropTypes.func,
  getScenarios: PropTypes.func,
  getHistoryForScenario: PropTypes.func,
  getUser: PropTypes.func,
  onClick: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { cohorts, cohortsById, scenarios, scenariosById, user } = state;
  let { filter = null } = ownProps.location.state || {};

  if (!filter && ownProps.match.params) {
    const { id, type } = ownProps.match.params || {};

    filter = id && type ? { id: Number(id), type } : null;
  }

  let activePage = Number(ownProps.match.params.activePage) || null;

  return {
    activePage,
    cohorts,
    cohortsById,
    filter,
    scenarios,
    scenariosById,
    user
  };
};

const mapDispatchToProps = dispatch => ({
  getAllCohorts: () => dispatch(getAllCohorts()),
  getCohorts: () => dispatch(getCohorts()),
  getScenarios: () => dispatch(getScenarios()),
  getHistoryForScenario: (...params) =>
    dispatch(getHistoryForScenario(...params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Downloads)
);
