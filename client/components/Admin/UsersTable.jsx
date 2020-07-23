import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Pagination, Table } from '@components/UI';
import UserRows from './UserRows';

// import { getUsers } from '@actions/users';
const MOBILE_WIDTH = 767;
const ROWS_PER_PAGE = 10;
const USER_ROLES = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  researcher: 'Researcher',
  facilitator: 'Facilitator',
  participant: 'Participant'
};

class UsersTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      activePage,
      cohort,
      columns,
      grantableRoles,
      onPageChange,
      rowsPerPage,
      pages,
      rows = {}
    } = this.props;

    const userRowsProps = { cohort, grantableRoles, rows, rowsPerPage };
    const tableRows = <UserRows {...userRowsProps} />;

    const IS_ON_MOBILE = window.innerWidth <= MOBILE_WIDTH;
    return (
      <Table striped selectable unstackable>
        {IS_ON_MOBILE ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="7">
                <Pagination
                  borderless
                  name="users"
                  activePage={activePage}
                  siblingRange={1}
                  boundaryRange={0}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  onPageChange={onPageChange}
                  totalPages={pages}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        ) : null}
        <Table.Header>
          <Table.Row>
            {Object.entries(columns).map(([key, { className, content }]) => (
              <Table.HeaderCell key={key} className={className}>
                {content}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body className="ut__tbody">{tableRows}</Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="7">
              <Pagination
                borderless
                name="users"
                activePage={activePage}
                siblingRange={1}
                boundaryRange={0}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                onPageChange={onPageChange}
                totalPages={pages}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

UsersTable.propTypes = {
  activePage: PropTypes.number,
  cohort: PropTypes.object,
  columns: PropTypes.object,
  grantableRoles: PropTypes.object,
  onPageChange: PropTypes.func,
  rowsPerPage: PropTypes.number,
  pages: PropTypes.number,
  rows: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  let rowsPerPage = ROWS_PER_PAGE;
  let grantableRoles = USER_ROLES;

  if (ownProps.grantableRoles) {
    grantableRoles = ownProps.grantableRoles;
  }

  if (ownProps.rowsPerPage) {
    rowsPerPage = ownProps.rowsPerPage;
  }

  return { grantableRoles, rowsPerPage };
};

// const mapDispatchToProps = dispatch => ({
//   // getUsers: () => dispatch(getUsers())
// });

export default connect(
  mapStateToProps,
  null
)(UsersTable);
