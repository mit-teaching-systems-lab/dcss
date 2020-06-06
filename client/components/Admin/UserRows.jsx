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
  const { user_id: id, role, checked, disabled } = data;
  if (disabled) {
    return;
  }
  const endpoint = checked ? '/api/roles/add' : '/api/roles/delete';
  const body = JSON.stringify({
    roles: [role],
    id
  });
  await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body
  });
};

const RoleCells = ({ id, username, roles }) => {
  return Object.keys(USER_ROLES).map((dbValue, index) => {
    const checked = roles ? roles.includes(dbValue) : false;
    const disabled = IMMUTABLE_ROLES.includes(dbValue);
    return (
      <Table.Cell key={`${username}-${dbValue}-${index}`}>
        {id ? (
          <Checkbox
            disabled={disabled}
            role={dbValue}
            user_id={id}
            defaultChecked={checked}
            onClick={onCheckboxClick}
          />
        ) : null}
      </Table.Cell>
    );
  });
};

const UserRows = (users, diff) => {
  if (!users) return null;

  if (diff) {
    users.push(
      ...Array(diff).fill({
        id: null,
        username: '',
        email: '',
        roles: []
      })
    );
  }

  return users.map((user, index) => {
    const roleCells = RoleCells(user);
    return (
      <Table.Row key={`${user.id}-${index}`}>
        <Table.Cell>{user.username || ' '}</Table.Cell>
        <Table.Cell>{user.email || ' '}</Table.Cell>
        {roleCells}
      </Table.Row>
    );
  });
};

export default UserRows;
