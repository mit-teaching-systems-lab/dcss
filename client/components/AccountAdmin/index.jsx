import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import UserRows from './UserRows';
import { setUsers } from '@client/actions';

class AccountAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null
        };

        this.getUsers = this.getUsers.bind(this);

        this.getUsers();
    }

    async getUsers() {
        const { users = null } = await (await fetch('api/roles')).json();

        this.props.setUsers({ users });
    }

    render() {
        const { users } = this.props;
        const usersDisplay = UserRows(users);

        return (
            <React.Fragment>
                <h1>Account Admin</h1>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Super Admin</Table.HeaderCell>
                            <Table.HeaderCell>Admin</Table.HeaderCell>
                            <Table.HeaderCell>Researcher</Table.HeaderCell>
                            <Table.HeaderCell>Facilitator</Table.HeaderCell>
                            <Table.HeaderCell>Participant</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>{usersDisplay}</Table.Body>
                </Table>
            </React.Fragment>
        );
    }
}

AccountAdmin.propTypes = {
    setUsers: PropTypes.func.isRequired,
    users: PropTypes.array
};

function mapStateToProps(state) {
    const { users } = state.admin;
    return { users };
}

const mapDispatchToProps = {
    setUsers
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountAdmin);
