import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Button,
    Header,
    Dimmer,
    Icon,
    Image,
    Loader,
    Menu,
    Message,
    Placeholder,
    Popup,
    Segment
} from 'semantic-ui-react';
import copy from 'copy-text-to-clipboard';
import {
    getCohort,
    setCohort,
    setCohortUserRole
} from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
import ConfirmAuth from '@client/components/ConfirmAuth';
import CohortParticipants from './CohortParticipants';
import CohortScenarios from './CohortScenarios';
import './Cohort.css';

export class Cohort extends React.Component {
    constructor(props) {
        super(props);

        let {
            params: { id }
        } = this.props.match;

        if (!id && this.props.id) {
            id = this.props.id;
        }

        // This is a hack to get through the testing on Monday.
        {
            let localCohort = localStorage.getItem('cohort');
            if (id && localCohort !== id) {
                localStorage.setItem('cohort', id);
            } else {
                if (localCohort !== null) {
                    id = Number(localCohort);
                }
            }
        }

        const { activeTab } = this.props;

        this.state = {
            activeTab,
            cohort: {
                id
            },
            tabs: {
                cohort: null,
                runs: null
            }
        };

        // Initializing the tabs happens after this.state is
        // created, so that this.state can be accessed within
        // this.getTab(...)
        //
        // We don't want to call setState, so we assign
        // the values directly to this.state.tabs[...].
        Object.keys(this.state.tabs).forEach(tab => {
            this.state.tabs[tab] = this.getTab(tab);
        });

        this.onClick = this.onClick.bind(this);
        this.getTab = this.getTab.bind(this);
    }

    async componentDidMount() {
        const {
            cohort: { id }
        } = this.state;

        await this.props.getCohort(Number(id));
        await this.props.getScenarios();

        const {
            cohort: { users },
            user: { username }
        } = this.props;

        if (!users.find(user => username === user.username)) {
            // For now we'll default all unknown
            // users as "participant".
            await this.props.setCohortUserRole({
                id: Number(id),
                role: 'participant'
            });
        }
    }

    onClick(e, { name: activeTab }) {
        const { tabs } = this.state;
        this.setState({
            activeTab,
            tabs: {
                ...tabs,
                [activeTab]: this.getTab(activeTab)
            }
        });
    }

    getTab(name) {
        const {
            cohort: { id }
        } = this.state;

        switch (name) {
            case 'cohort':
                return id ? (
                    <React.Fragment>
                        <CohortScenarios id={id} />
                        <ConfirmAuth requiredPermission="edit_all_cohorts">
                            <CohortParticipants id={id} />
                        </ConfirmAuth>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Dimmer active>
                            <Loader />
                        </Dimmer>
                        <Image src="/short-paragraph.png" />
                    </React.Fragment>
                );
            case 'runs':
                return (
                    <ConfirmAuth requiredPermission="edit_all_cohorts">
                        <React.Fragment>Runs {id}</React.Fragment>
                    </ConfirmAuth>
                );
            default:
                return null;
        }
    }

    render() {
        const {
            cohort,
            cohort: { name }
        } = this.props;
        const { activeTab } = this.state;
        const { onClick } = this;
        const cohortUrl = `${location.origin}/cohort/${cohort.id}`;

        return (
            <div>
                <Menu attached="top" tabular>
                    <Menu.Item
                        content={name}
                        name="cohort"
                        active={activeTab === 'cohort'}
                        onClick={onClick}
                    />
                    <ConfirmAuth requiredPermission="edit_scenarios_in_cohort">
                        <Menu.Item
                            content="Runs"
                            name="runs"
                            active={activeTab === 'runs'}
                            onClick={onClick}
                        />
                    </ConfirmAuth>
                </Menu>
                <Segment attached="bottom" className="cohort__content-pane">
                    <ConfirmAuth requiredPermission="edit_scenarios_in_cohort">
                        <Message
                            content={
                                <Header as="h3">
                                    {cohort.id ? (
                                        <React.Fragment>
                                            <code>{cohortUrl}</code>
                                            <Button.Group className="cohort__button--transparent cohort__button--spacing">
                                                <Popup
                                                    content="Copy cohort link to clipboard"
                                                    trigger={
                                                        <Button
                                                            icon
                                                            content={
                                                                <Icon name="clipboard outline" />
                                                            }
                                                            onClick={() =>
                                                                copy(cohortUrl)
                                                            }
                                                        />
                                                    }
                                                />
                                                <Popup
                                                    content="View this cohort as a participant"
                                                    trigger={
                                                        <Button
                                                            icon
                                                            content={
                                                                <Icon name="play" />
                                                            }
                                                            onClick={() => {
                                                                alert(
                                                                    'view cohort as participant. this is just a placeholder.'
                                                                );
                                                            }}
                                                        />
                                                    }
                                                />
                                            </Button.Group>
                                        </React.Fragment>
                                    ) : (
                                        <Placeholder>
                                            <Placeholder.Header image>
                                                <Placeholder.Line />
                                                <Placeholder.Line />
                                            </Placeholder.Header>
                                        </Placeholder>
                                    )}
                                </Header>
                            }
                        />
                    </ConfirmAuth>
                    {this.state.tabs[this.state.activeTab]}
                </Segment>
            </div>
        );
    }
}

Cohort.propTypes = {
    activeTab: PropTypes.string,
    scenarios: PropTypes.array,
    runs: PropTypes.array,
    users: PropTypes.array,
    cohort: PropTypes.shape({
        id: PropTypes.any,
        name: PropTypes.string,
        role: PropTypes.string,
        runs: PropTypes.array,
        scenarios: PropTypes.array,
        users: PropTypes.array
    }),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    id: PropTypes.any,
    match: PropTypes.shape({
        path: PropTypes.string,
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired,
    onChange: PropTypes.func,
    getCohort: PropTypes.func,
    setCohort: PropTypes.func,
    setCohortUserRole: PropTypes.func,
    getScenarios: PropTypes.func,
    user: PropTypes.object
};

const mapStateToProps = state => {
    const { username, permissions } = state.login;
    const { currentCohort: cohort } = state.cohort;
    const { scenarios } = state;
    return { cohort, scenarios, user: { username, permissions } };
};

const mapDispatchToProps = dispatch => ({
    getCohort: id => dispatch(getCohort(id)),
    getScenarios: () => dispatch(getScenarios()),
    setCohort: params => dispatch(setCohort(params)),
    setCohortUserRole: params => dispatch(setCohortUserRole(params))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Cohort)
);
