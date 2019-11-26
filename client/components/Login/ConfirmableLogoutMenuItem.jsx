import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Confirm, Menu } from 'semantic-ui-react';
import Session from '@client/util/session';
import './ConfirmableLogoutMenuItem.css';

class ConfirmableLogoutMenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.onCancel = this.onCancel.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }
    onCancel() {
        this.setState({ open: false });
    }
    onClick() {
        this.setState({ open: true });
    }
    onConfirm() {
        this.setState({ open: false });
        this.props.history.push('/logout');
    }
    render() {
        const { open } = this.state;
        const { onCancel, onClick, onConfirm } = this;
        const { username } = Session.isSessionActive()
            ? Session.getSession()
            : {};

        return (
            <React.Fragment>
                <Menu.Item
                    className="confirmablelogoutmenuitem__anchor-style"
                    content={`Log out (${username})`}
                    onClick={onClick}
                    position="right"
                />
                <Confirm
                    content={`You are currently logged in as "${username}". Are you sure you want to log out?`}
                    header="Log out confirmation"
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    open={open}
                    size="tiny"
                />
            </React.Fragment>
        );
    }
}

ConfirmableLogoutMenuItem.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(ConfirmableLogoutMenuItem);
