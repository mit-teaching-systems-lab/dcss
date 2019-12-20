import React from 'react';
import { Checkbox, Table } from 'semantic-ui-react';

const USER_ROLES = Object.freeze({
    super_admin: 'Super Admin',
    admin: 'Admin',
    researcher: 'Researcher',
    facilitator: 'Facilitator',
    participant: 'Participant'
});

const IMMUTABLE_ROLES = Object.freeze(['participant']);

const onCheckboxClick = async (event, data) => {
    const { email, username, role, checked, disabled } = data;
    if (disabled) {
        return;
    }
    const endpoint = checked ? '/api/roles/add' : '/api/roles/delete';
    const body = JSON.stringify({
        roles: [role],
        email,
        username
    });
    await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body
    });
};

const RoleCells = ({ username, email, roles }) => {
    return Object.keys(USER_ROLES).map((dbValue, index) => {
        const checked = roles ? roles.includes(dbValue) : false;
        const disabled = IMMUTABLE_ROLES.includes(dbValue);
        return (
            <Table.Cell key={`${username}-${dbValue}-${index}`}>
                <Checkbox
                    disabled={disabled}
                    role={dbValue}
                    username={username}
                    email={email}
                    defaultChecked={checked}
                    onClick={onCheckboxClick}
                />
            </Table.Cell>
        );
    });
};

const UserRows = users => {
    if (!users) return null;

    return users.map(user => {
        const roleCells = RoleCells(user);
        return (
            <Table.Row key={user.id}>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                {roleCells}
            </Table.Row>
        );
    });
};

export default UserRows;
