import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Dropdown, Icon, Menu } from 'semantic-ui-react';
import ConfirmableLogoutMenuItem from '@client/components/Login/ConfirmableLogoutMenuItem';

import Session from '@client/util/session';
const MOBILE_WIDTH = 767;

Session.timeout();

const Navigation = () => {
    const [menuExpanded, setMenuExpanded] = useState(
        !(window.innerWidth <= MOBILE_WIDTH)
    );
    window.onresize = () => {
        if (window.innerWidth > MOBILE_WIDTH && !menuExpanded) {
            // Make the menu appear if the user resizes the window to be wider
            setMenuExpanded(true);
        }
    };

    return (
        <React.Fragment>
            <Button
                icon
                fluid
                labelPosition="left"
                basic
                className="nav__mobile"
                id="nav__mobile--button"
                onClick={() => setMenuExpanded(!menuExpanded)}
                aria-controls="nav"
            >
                <Icon name="content" />
                MENU
            </Button>
            {menuExpanded && (
                <Menu id="nav" className="nav" stackable>
                    <Menu.Item className="navigation__menu-item-logo">
                        <NavLink to="/">Teacher Moments</NavLink>
                    </Menu.Item>

                    <Menu.Menu>
                        <Dropdown
                            simple
                            item
                            text={<NavLink to="/">Moments</NavLink>}
                        >
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <NavLink to="/official">Official</NavLink>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <NavLink to="/community">Community</NavLink>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                    {Session.isSessionActive() && (
                        <React.Fragment>
                            <Menu.Item>
                                <NavLink exact to="/editor/new">
                                    Create a Moment
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item>
                                <NavLink to="/cohorts">
                                    Cohorts Management
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item>
                                <NavLink to="/researcher">Data Export</NavLink>
                            </Menu.Item>
                            <Menu.Item>
                                <NavLink to="/account-administration">
                                    Account Administration
                                </NavLink>
                            </Menu.Item>
                            <ConfirmableLogoutMenuItem />
                        </React.Fragment>
                    )}
                    {!Session.isSessionActive() && (
                        <Menu.Item position="right">
                            <NavLink to="/login">Log in</NavLink>
                        </Menu.Item>
                    )}
                </Menu>
            )}
        </React.Fragment>
    );
};

export default Navigation;
