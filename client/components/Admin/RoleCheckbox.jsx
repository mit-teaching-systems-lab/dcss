import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Identity from '@utils/Identity';
import { Checkbox, Popup } from '@components/UI';
import { notify } from '@components/Notification';
import { addCohortUserRole, deleteCohortUserRole } from '@actions/cohort';
import { addUserRole, deleteUserRole } from '@actions/role';

const RoleCheckbox = props => {
  const {
    cohort,
    content,
    role,
    user,
    addUserRole,
    addCohortUserRole,
    deleteUserRole,
    deleteCohortUserRole
  } = props;

  const onCheckboxClick = async (event, data) => {
    const { checked, disabled } = data;
    if (disabled) {
      return;
    }

    /*
      Rules:

      1.  Granting a role from within a cohort will grant the role
          to the target user across the entire application, but will
          limit scope of access to only specified resources.

          - This is necessary to unlock features that require specific
            site-wide permissions. For example, a facilitator can promote
            a participant to a researcher and given access to consented
            cohort data. That researcher may later receive access to other
            cohorts, from other facilitators. Only a super admin can
            revoke roles across the whole site.

      2.  Revoking a role from within a cohort will revoke the role
          from the target user for only the cohort.
     */

    let uRoleResult;
    let cRoleResult;

    if (checked) {
      // Add the role to this user.
      uRoleResult = await addUserRole(user.id, role);
      // console.log('uRoleResult: ', uRoleResult);
      if (uRoleResult.addedCount) {
        notify({ message: `${user.username} is now a ${role}` });
      }

      // notify
      // If a cohort object is present, add the role to
      // this user, for this cohort.
      if (cohort) {
        cRoleResult = await addCohortUserRole(cohort.id, user.id, role);
        if (cRoleResult.addedCount) {
          notify({
            message: `${user.username} is now a ${role} in ${cohort.name}`
          });
        }
        // console.log('cRoleResult: ', cRoleResult);
      }
    } else {
      // If a cohort object is present, ONLY delete the role from
      // this user, for this cohort.
      if (cohort) {
        cRoleResult = await deleteCohortUserRole(cohort.id, user.id, role);
        if (cRoleResult.deletedCount) {
          notify({
            message: `${user.username} is no longer a ${role} in ${cohort.name}`
          });
        }
        // console.log('cRoleResult: ', cRoleResult);
      } else {
        uRoleResult = await deleteUserRole(user.id, role);
        if (uRoleResult.deletedCount) {
          notify({ message: `${user.username} is no longer a ${role}` });
        }
      }
    }
  };

  const trigger = (
    <Checkbox
      disabled={props.disabled}
      defaultChecked={props.checked}
      onClick={onCheckboxClick}
    />
  );

  return (
    <Popup inverted basic size="small" content={content} trigger={trigger} />
  );
};

RoleCheckbox.propTypes = {
  checked: PropTypes.bool,
  content: PropTypes.string,
  disabled: PropTypes.bool,
  cohort: PropTypes.object,
  role: PropTypes.string,
  user: PropTypes.object,
  addUserRole: PropTypes.func,
  addCohortUserRole: PropTypes.func,
  deleteUserRole: PropTypes.func,
  deleteCohortUserRole: PropTypes.func
};

// const mapStateToProps = state => {
//   const { usersById } = state;
//   return { usersById };
// };

const mapDispatchToProps = dispatch => ({
  addUserRole: (...params) => dispatch(addUserRole(...params)),
  addCohortUserRole: (...params) => dispatch(addCohortUserRole(...params)),
  deleteUserRole: (...params) => dispatch(deleteUserRole(...params)),
  deleteCohortUserRole: (...params) => dispatch(deleteCohortUserRole(...params))
});

export default connect(null, mapDispatchToProps)(RoleCheckbox);
