import React, { Component, Fragment } from 'react';
import Identity from '@utils/Identity';
import escapeRegExp from 'lodash.escaperegexp';
import PropTypes from 'prop-types';
import { Parser } from 'json2csv';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Container,
  Dropdown,
  Icon,
  /*Input,*/
  Menu,
  Pagination,
  Table,
  Title
} from '@components/UI';
import {
  getChatTranscriptsByChatId,
  getChatTranscriptsByCohortId,
  getChatTranscriptsByScenarioId
} from '@actions/chat';
import { getCohorts } from '@actions/cohort';
import { getHistoryForScenario } from '@actions/history';
import { getScenariosIncrementally } from '@actions/scenario';
import { getUser } from '@actions/user';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import CSV from '@utils/csv';
import Layout from '@utils/Layout';
import Media from '@utils/Media';
import { makeHeader } from '@utils/data-table';
import shorten from '@utils/shorten';
import '../Cohorts/Cohort.css';
import '../Cohorts/DataTable.css';
import './Downloads.css';

const ROWS_PER_PAGE = 10;

function getFilterSubject(filter, props) {
  if (!filter) {
    return null;
  }

  const subject = {
    ...filter,
    label: '',
    contents: null
  };

  if (filter.type === 'cohort') {
    let cohort = props.cohortsById[filter.id];
    subject.label = cohort.name;
    subject.contents = cohort;
  }

  if (filter.type === 'scenario') {
    let scenario = props.scenariosById[filter.id];
    subject.label = scenario.title;
    subject.contents = scenario;
  }

  return subject;
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
    this.triggerDownload = this.triggerDownload.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      await this.props.getScenariosIncrementally();

      this.setState({ isReady: true });
    }
  }

  onDownloadSearchChange(options, value) {
    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    return options.filter(option => escapedRegExp.test(option.text));
  }

  onPageChange(event, { activePage }) {
    this.props.history.push(`/downloads/${activePage}`);
    this.setState({
      activePage
    });
  }

  async requestDownload({ cohort, scenario }) {
    const { getHistoryForScenario } = this.props;
    const scenarios = scenario
      ? [scenario.id]
      : cohort.scenarios.map(v => (typeof v === 'number' ? v : v.id));
    const files = [];

    for (let id of scenarios) {
      // TODO: change this to an object parameter
      const { prompts, responses } = await getHistoryForScenario(
        id,
        cohort && cohort.id
      );

      const records = responses.flat();

      if (records.length) {
        records.forEach(record => {
          const {
            is_skip,
            response_id,
            content = '',
            transcript = '',
            value = ''
          } = record;
          const prompt = prompts.find(
            prompt => prompt.responseId === response_id
          );
          record.header = makeHeader(prompt, prompts);
          record.content = content;
          record.content += is_skip ? '(skipped)' : ` ${transcript || value}`;

          if (Media.isAudioFile(value)) {
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
          'consent_granted_by_user',
          'cohort_id'
        ];

        const file = Identity.key({ cohort, id });
        const parser = new Parser({ fields });
        const csv = parser.parse(records);

        files.push([`${file}.csv`, csv]);
      }
    }

    const transcripts = cohort
      ? await this.props.getChatTranscriptsByCohortId(cohort.id)
      : await this.props.getChatTranscriptsByScenarioId(scenario.id);

    if (transcripts.length) {
      const fields = [
        'id',
        'chat_id',
        'user_id',
        'textContent',
        'content',
        'created_at',
        'updated_at',
        'deleted_at',
        'is_quotable',
        'is_joinpart',
        'response_id',
        'recipient_id'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(transcripts);

      files.push(['chat-messages.csv', csv]);
    }

    return files;
  }

  async triggerDownload(files) {
    if (Object.entries(files).length === 1) {
      const [file, csv] = files[0];
      CSV.download(file, csv);
    } else {
      CSV.downloadZipAsync(files);
    }
  }

  render() {
    const {
      onDownloadSearchChange,
      onPageChange,
      requestDownload,
      triggerDownload
    } = this;
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
      <Icon.Group size="large" className="ig__multiple-file">
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

    let rowCount = 0;
    const downloads = cohorts.reduce((accum, cohort, index) => {
      if (hasAccessToCohort(cohort)) {
        const onDownloadByCohortClick = async () => {
          await triggerDownload(await requestDownload({ cohort }));
        };

        dropdownCohortSelectOptions.push({
          key: Identity.key({ cohort, index }),
          value: cohort.id,
          text: shorten(cohort.name, 50)
        });

        if (filter && (filter.type !== 'cohort' || filter.id !== cohort.id)) {
          return accum;
        }

        accum.push(
          ...cohort.scenarios.map((id, index) => {
            const scenario = scenariosById[id];
            const onDownloadByScenarioRunClick = async () => {
              await triggerDownload(
                await requestDownload({ cohort, scenario })
              );
            };

            const stitle = (scenario && scenario.title) || '';

            const clabel = `Download a zip containing csv files containing responses for all scenarios in "${cohort.name}"`;
            const slabel = `Download a csv file containing responses to only "${stitle}", from the cohort "${cohort.name}"`;

            // If this is the first scenario in a cohort, or this is the first scenario
            // listed on a page of scenarios, then display the download zip icon
            const showDownloadZipIcon =
              index === 0 || rowCount % ROWS_PER_PAGE === 0;
            rowCount++;

            return (
              <Table.Row
                key={Identity.key({ ...cohort, id })}
                created_at={Date.now(cohort.created_at)}
              >
                {showDownloadZipIcon ? (
                  <Table.Cell.Clickable
                    verticalAlign="top"
                    aria-label={clabel}
                    popup={clabel}
                    content={downloadZipIcon}
                    onClick={onDownloadByCohortClick}
                  />
                ) : (
                  <Table.Cell.Clickable
                    className="dl__left_col_empty"
                    verticalAlign="top"
                    aria-label={clabel}
                    popup={clabel}
                    onClick={onDownloadByCohortClick}
                  />
                )}

                <Table.Cell.Clickable
                  verticalAlign="top"
                  aria-label={slabel}
                  popup={slabel}
                  content={downloadRunIcon}
                  onClick={onDownloadByScenarioRunClick}
                />
                <Table.Cell
                  verticalAlign="top"
                  className="dtr__cell-fluid-half"
                >
                  {cohort && cohort.name}
                </Table.Cell>
                <Table.Cell verticalAlign="top" className="dt__cell-truncated">
                  {scenario && scenario.title}
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
          const onDownloadByScenarioRunClick = async () => {
            await triggerDownload(await requestDownload({ scenario }));
          };

          dropdownScenarioSelectOptions.push({
            key: Identity.key({ scenario, index }),
            value: scenario.id,
            text: shorten(scenario.title, 50)
          });

          if (
            filter &&
            (filter.type !== 'scenario' || filter.id !== scenario.id)
          ) {
            return accum;
          }

          const label = `Download a csv file containing responses to only "${scenario.title}"`;

          accum.push(
            <Table.Row
              key={Identity.key({ scenario })}
              created_at={Date.now(scenario.created_at)}
            >
              <Table.Cell className="dl__left_col_empty"> </Table.Cell>
              <Table.Cell.Clickable
                verticalAlign="top"
                popup={label}
                aria-label={label}
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

    const filterSubject = getFilterSubject(filter, this.props);
    const menuItemDownloadsFilterDisplay = filterSubject
      ? `Showing downloads for ${filterSubject.type} "${filterSubject.label}". Click to download all.`
      : 'Click to download all.';

    const menuItemDownloadsFilterClearLabel = filterSubject
      ? `Clear filter for ${filterSubject.type} "${filterSubject.label}", and see all downloads.`
      : null;

    const menuItemDownloadsFilterClear = filterSubject ? (
      <Menu.Item.Tabbable
        key="menu-item-downloads-filter-clear"
        aria-label={menuItemDownloadsFilterClearLabel}
        popup={menuItemDownloadsFilterClearLabel}
        onClick={() => {
          this.props.history.push('/downloads');
          this.setState({ filter: null });
        }}
      >
        {menuItemDownloadsFilterClearLabel}
      </Menu.Item.Tabbable>
    ) : null;

    const menuItemDownloadsAll = (
      <Menu.Item.Tabbable
        key="menu-item-downloads-count"
        aria-label={menuItemDownloadsFilterDisplay}
        popup={menuItemDownloadsFilterDisplay}
        onClick={async () => {
          const downloads = [];

          for (let cohort of cohorts) {
            downloads.push(...(await requestDownload({ cohort })));
          }

          for (let scenario of scenarios) {
            downloads.push(...(await requestDownload({ scenario })));
          }

          await triggerDownload(downloads);
        }}
      >
        <Icon.Group className="em__icon-group-margin">
          {downloadRunIcon.props.children}
        </Icon.Group>
        Download all ({downloads.length})
      </Menu.Item.Tabbable>
    );

    /*
    const menuItemDownloads = (
      <Menu.Item.Tabbable
        key="menu-item-downloads-count"
        aria-label={menuItemDownloadsFilterDisplay}
        popup={menuItemDownloadsFilterDisplay}
      >
        <Icon.Group className="em__icon-group-margin">
          {downloadRunIcon.props.children}
        </Icon.Group>
        {menuItemDownloadsFilterDisplay} ({downloads.length})
      </Menu.Item.Tabbable>
    );
    let filterDisplay = null;
    if (filter) {
      filterDisplay =
        filter.type === 'cohort'
          ? cohortsById[filter.id].name
          : scenariosById[filter.id].title;
    }
    const menuItemFilterDisplay = filter ? (
      <Menu.Item.Tabbable key="menu-item-filter-display">
        <Icon.Group className="em__icon-group-margin">
          {downloadRunIcon.props.children}
        </Icon.Group>
        {shorten(filterDisplay, 50)}
      </Menu.Item.Tabbable>
    ) : null;
  */
    const pushFilterToHistory = ({ id, type }) => {
      if (id !== -1) {
        this.props.history.push(`/downloads/${type}/${id}`);
        this.setState({ filter: { type, id } });
      }
    };

    const menuItemCohortSelect = dropdownCohortSelectOptions ? (
      <Menu.Item.Tabbable
        key="menu-item-cohort-select"
        style={{ width: '30%' }}
      >
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
      </Menu.Item.Tabbable>
    ) : null;

    const menuItemScenarioSelect = dropdownScenarioSelectOptions ? (
      <Menu.Item.Tabbable
        key="menu-item-scenario-select"
        style={{ width: '30%' }}
      >
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
      </Menu.Item.Tabbable>
    ) : null;

    /*
    const menuItemClearSelect = filter ? (
      <Menu.Item.Tabbable
        key="menu-item-clear-select"
        as={NavLink}
        exact
        to="/downloads/1"
      >
        <Icon name="x" /> Clear filter
      </Menu.Item.Tabbable>
    ) : null;
    const menuItemDownloadsSearch = (
      <Menu.Menu key="menu-item-downloads-search" position="right">
        <Menu.Item.Tabbable name="Search downloads">
          <Input
            icon="search"
            placeholder="Search..."
            onChange={onDownloadSearchChange}
          />
        </Menu.Item.Tabbable>
      </Menu.Menu>
    );
    */

    const menuBar = (
      <EditorMenu
        type="downloads"
        items={{
          left: [
            // filter ? menuItemFilterDisplay : menuItemDownloadsCount,
            menuItemDownloadsAll,
            menuItemDownloadsFilterClear
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

    const fallbackCohortHeader = 'Cohort name';

    const nonMobileCohortSelect = menuItemCohortSelect
      ? menuItemCohortSelect.props.children
      : fallbackCohortHeader;

    const cohortSelect = Layout.isNotForMobile()
      ? nonMobileCohortSelect
      : fallbackCohortHeader;

    const fallbackScenarioHeader = 'Scenario title';

    const nonMobileScenarioSelect = menuItemScenarioSelect
      ? menuItemScenarioSelect.props.children
      : fallbackScenarioHeader;

    const scenarioSelect = Layout.isNotForMobile()
      ? nonMobileScenarioSelect
      : fallbackScenarioHeader;

    return (
      <Fragment>
        <Title content="Downloads" />
        {menuBar}
        <Container fluid>
          <Table className="dl__table" role="grid" unstackable definition>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell> </Table.HeaderCell>
                <Table.HeaderCell> </Table.HeaderCell>
                <Table.HeaderCell className="dtr__cell-fluid-half-th">
                  {cohortSelect}
                </Table.HeaderCell>
                <Table.HeaderCell className="dtr__cell-fluid-half-th">
                  {user.is_super ? scenarioSelect : 'Scenario'}
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
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan="4">
                  {downloadsPages > 1 ? (
                    <Pagination
                      borderless
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
  getChatTranscriptsByChatId: PropTypes.func,
  getChatTranscriptsByCohortId: PropTypes.func,
  getChatTranscriptsByScenarioId: PropTypes.func,
  getCohorts: PropTypes.func,
  getScenariosIncrementally: PropTypes.func,
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
  getChatTranscriptsByChatId: id => dispatch(getChatTranscriptsByChatId(id)),
  getChatTranscriptsByCohortId: id =>
    dispatch(getChatTranscriptsByCohortId(id)),
  getChatTranscriptsByScenarioId: id =>
    dispatch(getChatTranscriptsByScenarioId(id)),
  getCohorts: () => dispatch(getCohorts()),
  getScenariosIncrementally: updater =>
    dispatch(getScenariosIncrementally(updater)),
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
