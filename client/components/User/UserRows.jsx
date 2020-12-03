import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { Table } from '@components/UI';
import RoleCheckbox from '@components/Admin/RoleCheckbox';
import {
  COHORT_ROLE_GRANT_WARNINGS,
  SITE_ROLE_GRANT_WARNINGS
} from '@components/Admin/constants';

const USER_ROLES = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  researcher: 'Researcher',
  facilitator: 'Facilitator',
  participant: 'Participant'
};

const IMMUTABLE_ROLES = ['participant'];

const RoleCells = ({ cohort, grantableRoles, targetUser, adminUser }) => {
  const roleGrantWarnings = cohort
    ? COHORT_ROLE_GRANT_WARNINGS
    : SITE_ROLE_GRANT_WARNINGS;

  return Object.keys(grantableRoles).map((role, index) => {
    const checked = targetUser.roles ? targetUser.roles.includes(role) : false;

    // The current user cannot change their own roles...
    // UNLESS they are a super admin (applied later)
    const isSameUser = targetUser.id === adminUser.id;

    // If the role being changed is not allowed to be changed
    const isImmutableRole = IMMUTABLE_ROLES.includes(role);

    let disabled =
      isSameUser ||
      isImmutableRole ||
      targetUser.is_anonymous ||
      targetUser.is_super;

    let tip = checked
      ? `Revoke ${USER_ROLES[role]} access from ${targetUser.username}.`
      : `Grant ${USER_ROLES[role]} access to ${targetUser.username}. ${roleGrantWarnings[role]}`;

    let whyRoleCannotBeChanged = isSameUser
      ? `You cannot change your own roles.`
      : `${USER_ROLES[role]} role cannot be changed.`;

    if (adminUser.is_super) {
      if (targetUser.id === adminUser.id) {
        tip = checked
          ? `Revoke your ${USER_ROLES[role]} access.`
          : `Grant yourself ${USER_ROLES[role]} access.`;
      }
      disabled = false;
    }

    const tipImmutable = disabled ? whyRoleCannotBeChanged : tip;

    const content = targetUser.is_anonymous
      ? `${targetUser.username} is an anonymous account and cannot be promoted.`
      : tipImmutable;

    if (targetUser.is_anonymous) {
      disabled = true;
    }

    const roleCheckBox = (
      <RoleCheckbox
        tabIndex={0}
        checked={checked}
        cohort={cohort}
        content={content}
        disabled={disabled}
        role={role}
        user={targetUser}
      />
    );
    return (
      <Table.Cell
        textAlign="center"
        key={Identity.key(role + targetUser.id + index)}
      >
        {targetUser.id ? roleCheckBox : null}
      </Table.Cell>
    );
  });
};

const UserRows = props => {
  const {
    cohort = null,
    adminUser,
    grantableRoles = {},
    rows = {},
    rowsPerPage = 10,
    usersById = {}
  } = props;

  const entries = Object.entries(rows);
  const rowCount = entries.length;

  if (!rowCount) {
    return null;
  }

  const length = rowsPerPage - rowCount;
  if (length) {
    const style = {
      padding: '0.785714em',
      height: '42px',
      color: 'transparent'
    };
    entries.push(
      ...Array.from({ length }, (_, index) => {
        const key = Identity.key({ index, style });
        return (
          <Table.Row key={key}>
            <Table.Cell colSpan={100} style={style}>
              &nbsp;
            </Table.Cell>
          </Table.Row>
        );
      })
    );
  }

  return entries.map(entry => {
    if (React.isValidElement(entry)) {
      return entry;
    }

    // console.log(entry);
    const [id, cellsContents] = entry;
    const targetUser = cohort ? cohort.usersById[id] : usersById[id];

    if (!targetUser) {
      return null;
    }

    const roleCells = RoleCells({
      cohort,
      grantableRoles,
      targetUser,
      adminUser
    });

    return (
      <Table.Row key={Identity.key(targetUser)}>
        {cellsContents.map(content => {
          // This is for supporting Table.Cell.Clickable and
          // similar other valid table cell stand-ins.
          if (React.isValidElement(content)) {
            return content;
          }
          return (
            <Table.Cell key={Identity.key(content)}>
              {content || ' '}
            </Table.Cell>
          );
        })}
        {roleCells}
      </Table.Row>
    );
  });
};

UserRows.propTypes = {
  cohort: PropTypes.object,
  adminUser: PropTypes.object,
  grantableRoles: PropTypes.object,
  rows: PropTypes.object,
  rowsPerPage: PropTypes.number,
  usersById: PropTypes.object
};

const mapStateToProps = state => {
  const { user, usersById } = state;
  return { adminUser: user, usersById };
};

export default connect(
  mapStateToProps,
  null
)(UserRows);
