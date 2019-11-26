import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setScenarios } from '@client/actions';

import Navigation from './Navigation';
import Routes from './Routes';
import './Nav.css';

import Session from '@client/util/session';

Session.timeout();

class App extends Component {
    constructor(props) {
        super(props);

        this.getScenarios = this.getScenarios.bind(this);
    }

    async componentDidMount() {
        const scenarios = await this.getScenarios();
        if (scenarios) {
            this.props.setScenarios(scenarios);
        }
    }

    async getScenarios() {
        const { scenarios, status } = await (await fetch(
            '/api/scenarios'
        )).json();

        if (status === 200) {
            return { scenarios };
        }
    }

    render() {
        return (
            <Router>
                <Navigation />
                <Routes />
            </Router>
        );
    }
}

App.propTypes = {
    setScenarios: PropTypes.func,
    scenarios: PropTypes.array
};

const mapStateToProps = state => {
    const { scenarios } = state.scenario;
    return { scenarios };
};

const mapDispatchToProps = {
    setScenarios
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
