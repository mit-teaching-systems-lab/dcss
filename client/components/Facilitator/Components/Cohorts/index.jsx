import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    Button,
    Card,
    Container,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Loader,
    Menu,
    Modal
} from 'semantic-ui-react';
import {
    getCohorts,
    getCohort,
    setCohort,
    createCohort
} from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
import CohortCard from './CohortCard';
import CohortEmpty from './CohortEmpty';
import EditorMenu from '@components/EditorMenu';

export class Cohorts extends React.Component {
    constructor(props) {
        super(props);

        const { params, path } = this.props.match;

        const id = path === '/cohort/:id' && params ? params.id : null;

        this.state = {
            createIsVisible: false,
            cohort: new CohortEmpty({ id })
        };

        this.onCancelCreateCohort = this.onCancelCreateCohort.bind(this);
        this.onChangeCohortName = this.onChangeCohortName.bind(this);
        this.onClickOpenCreateCohort = this.onClickOpenCreateCohort.bind(this);
        this.onSubmitCreateCohort = this.onSubmitCreateCohort.bind(this);
    }

    async componentDidMount() {
        await this.props.getCohorts();
        await this.props.getScenarios();
    }

    async onSubmitCreateCohort() {
        const { name } = this.state.cohort;

        const { id } = await this.props.createCohort({
            name
        });

        location.href = `/cohort/${id}`;
    }

    onCancelCreateCohort() {
        this.setState({ createIsVisible: false });
    }

    onChangeCohortName(event, { name, value }) {
        this.setState({ cohort: { [name]: value } });
    }

    onClickOpenCreateCohort() {
        this.setState({ createIsVisible: true });
    }

    render() {
        const { cohorts, scenarios } = this.props;
        const { cohort, createIsVisible } = this.state;
        const {
            onCancelCreateCohort,
            onChangeCohortName,
            onClickOpenCreateCohort,
            onSubmitCreateCohort
        } = this;

        const lookupCohort = id =>
            scenarios.find(scenario => scenario.id === id);

        return (
            <React.Fragment>
                <EditorMenu
                    type="cohorts"
                    items={{
                        left: [
                            <Menu.Item
                                key="menu-item-create-cohort"
                                name="Create a cohort"
                                onClick={onClickOpenCreateCohort}
                                className="cohort__menu-item--padding"
                            >
                                <Icon.Group>
                                    <Icon name="group" />
                                    <Icon
                                        corner="top right"
                                        name="add"
                                        color="green"
                                    />
                                </Icon.Group>
                            </Menu.Item>
                        ],
                        search: {
                            source: cohorts,
                            onResultSelect: (event, { selected }) => {
                                location.href = `/cohort/${selected.id}`;
                            },
                            onSearchChange: (event, props, setState) => {
                                const { value } = props;
                                const escapedRegExp = new RegExp(
                                    _.escapeRegExp(value),
                                    'i'
                                );
                                const results = cohorts.filter(record => {
                                    if (escapedRegExp.test(record.name)) {
                                        return true;
                                    }

                                    if (
                                        record.users.some(({ username }) =>
                                            escapedRegExp.test(username)
                                        )
                                    ) {
                                        return true;
                                    }

                                    if (
                                        record.scenarios.some(
                                            id =>
                                                escapedRegExp.test(
                                                    lookupCohort(id).title
                                                ) ||
                                                escapedRegExp.test(
                                                    lookupCohort(id).description
                                                )
                                        )
                                    ) {
                                        return true;
                                    }
                                    return false;
                                });

                                setState({
                                    search: {
                                        isLoading: false,
                                        results,
                                        source: cohorts,
                                        value
                                    }
                                });
                            },
                            renderer: ({
                                id,
                                name
                                /*
                                users,
                                runs,
                                scenarios
                                */
                            }) => {
                                return (
                                    <div key={id}>
                                        <p>{name}</p>
                                    </div>
                                );
                            }
                        }
                    }}
                />
                <Container fluid>
                    <Modal open={createIsVisible} size="small">
                        <Header icon="group" content="Create a cohort" />
                        <Modal.Content>
                            <Form onSubmit={onSubmitCreateCohort}>
                                <Input
                                    fluid
                                    focus
                                    placeholder="Enter a name for your cohort"
                                    name="name"
                                    value={cohort.name}
                                    onChange={onChangeCohortName}
                                    onSubmit={onSubmitCreateCohort}
                                />
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={onCancelCreateCohort}>
                                Cancel
                            </Button>
                            <Button
                                color="green"
                                onClick={onSubmitCreateCohort}
                            >
                                Create
                            </Button>
                        </Modal.Actions>
                    </Modal>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column stretched>
                                {cohorts && cohorts.length ? (
                                    <Card.Group>
                                        {cohorts.map(({ id }) => (
                                            <CohortCard key={id} id={id} />
                                        ))}
                                    </Card.Group>
                                ) : (
                                    <Loader inverted content="Loading" />
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}

Cohorts.propTypes = {
    cohorts: PropTypes.array,
    cohort: PropTypes.object,
    status: PropTypes.oneOf(['success', 'error', 'requesting', 'init']),
    ids: PropTypes.arrayOf(PropTypes.number),
    error: PropTypes.shape({
        message: PropTypes.string,
        stack: PropTypes.string,
        status: PropTypes.oneOf([PropTypes.string, PropTypes.number])
    }),
    createCohort: PropTypes.func,
    getCohorts: PropTypes.func,
    getCohort: PropTypes.func,
    setCohort: PropTypes.func,
    getScenarios: PropTypes.func,
    scenarios: PropTypes.array,
    match: PropTypes.shape({
        path: PropTypes.string,
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired
};

const mapStateToProps = state => {
    const { currentCohort: cohort, userCohorts: cohorts } = state.cohort;
    const { scenarios } = state;
    return { cohort, cohorts, scenarios };
};

const mapDispatchToProps = dispatch => ({
    getCohorts: () => dispatch(getCohorts()),
    getCohort: id => dispatch(getCohort(id)),
    setCohort: params => dispatch(setCohort(params)),
    getScenarios: () => dispatch(getScenarios()),
    createCohort: params => dispatch(createCohort(params))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Cohorts)
);
