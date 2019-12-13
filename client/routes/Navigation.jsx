import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Dropdown, Icon, Menu } from 'semantic-ui-react';

import ConfirmAuth from '@client/components/ConfirmAuth';
import ConfirmableLogoutMenuItem from '@client/components/Login/ConfirmableLogoutMenuItem';
import Session from '@client/util/session';

Session.timeout();

const MOBILE_WIDTH = 767;
const restrictedNav = [
    {
        text: 'Create a Moment',
        path: '/editor/new',
        permission: 'create_scenario'
    },
    {
        text: 'Cohorts',
        path: '/cohorts',
        permission: 'create_cohort'
    },
    {
        text: 'My Cohort',
        path: '/cohort',
        permission: 'view_invited_cohorts'
    },
    {
        text: 'Research',
        path: '/research',
        permission: 'view_run_data'
    },
    {
        text: 'Account Administration',
        path: '/account-administration',
        permission: 'edit_permissions'
    }
];

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
    const authorizedNav = restrictedNav.map(
        ({ text, path, permission }, index) => {
            return (
                <ConfirmAuth key={index} requiredPermission={permission}>
                    <Menu.Item>
                        <NavLink to={path}>{text}</NavLink>
                    </Menu.Item>
                </ConfirmAuth>
            );
        }
    );
    const { username } = Session.getSession();

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
                                {Session.isSessionActive() && (
                                    <React.Fragment>
                                        <ConfirmAuth requiredPermission="create_scenario">
                                            <Dropdown.Item>
                                                <NavLink
                                                    to={{
                                                        pathname: `/author/${username}`
                                                    }}
                                                >
                                                    My Moments
                                                </NavLink>
                                            </Dropdown.Item>
                                        </ConfirmAuth>
                                        <Dropdown.Item>
                                            <NavLink to="/continue">
                                                Continue Moments
                                            </NavLink>
                                        </Dropdown.Item>
                                    </React.Fragment>
                                )}
                                <Dropdown.Item>
                                    <NavLink to="/official">Official</NavLink>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <NavLink to="/community">Community</NavLink>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>

                    {authorizedNav}

                    {Session.isSessionActive() ? (
                        <ConfirmableLogoutMenuItem />
                    ) : (
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
