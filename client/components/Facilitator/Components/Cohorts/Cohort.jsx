import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Dimmer, Image, Loader, Menu, Segment } from 'semantic-ui-react';
import { getCohort, setCohort } from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
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
                        <CohortParticipants id={id} />
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
                return <React.Fragment>Runs {id}</React.Fragment>;
            default:
                return null;
        }
    }

    render() {
        const {
            cohort: { name }
        } = this.props;
        const { activeTab } = this.state;
        const { onClick } = this;

        return (
            <div>
                <Menu attached="top" tabular>
                    <Menu.Item
                        content={name}
                        name="cohort"
                        active={activeTab === 'cohort'}
                        onClick={onClick}
                    />
                    <Menu.Item
                        content="Runs"
                        name="runs"
                        active={activeTab === 'runs'}
                        onClick={onClick}
                    />
                </Menu>
                <Segment attached="bottom" className="cohort__content-pane">
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
    getScenarios: PropTypes.func
};

const mapStateToProps = state => {
    const { currentCohort: cohort } = state.cohort;
    const { scenarios } = state;
    return { cohort, scenarios };
};

const mapDispatchToProps = dispatch => ({
    getCohort: id => dispatch(getCohort(id)),
    setCohort: params => dispatch(setCohort(params)),
    getScenarios: () => dispatch(getScenarios())
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Cohort)
);
