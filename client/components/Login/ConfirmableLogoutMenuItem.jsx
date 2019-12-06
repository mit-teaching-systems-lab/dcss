import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Button,
    Confirm,
    Container,
    Icon,
    Menu,
    Popup
} from 'semantic-ui-react';
import copy from 'copy-text-to-clipboard';
import Session from '@client/util/session';
import './ConfirmableLogoutMenuItem.css';

class ConfirmableLogoutMenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            name: 'clipboard outline'
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
        const { open, name } = this.state;
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
                    content={
                        <Container className="confirmablelogoutmenuitem__container--padding">
                            <p>You are currently logged in as: </p>
                            <Popup
                                content="Copy user name to clipboard"
                                trigger={
                                    <Button
                                        icon
                                        className="confirmablelogoutmenuitem__button"
                                        content={
                                            <React.Fragment>
                                                <code>{username}</code>
                                                <Icon name={name} />
                                            </React.Fragment>
                                        }
                                        onClick={() => {
                                            copy(username);
                                            this.setState({
                                                name: 'clipboard'
                                            });
                                        }}
                                    />
                                }
                            />
                            <p>Are you sure you want to log out?</p>
                        </Container>
                    }
                    header="Log out confirmation"
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    confirmButton="Yes, log me out"
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
