import './Dashboard.css';

import { Button, Card, Icon } from '@components/UI';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import RecentCohorts from './RecentCohorts';
import { getRecentCohorts } from '../../actions/cohort';

const SideNav = () => {
  return (
    <aside className="dashboard-sidenav">
      <section className="dashboard-sidenav__section">
        <p className="dashboard-sidenav__subtitle">Your tools</p>
        <ul>
          <li>
            <a href="#recent-scenarios">Recent scenarios</a>
          </li>
          <li>
            <a href="#recent-cohorts">Recent cohorts</a>
          </li>
        </ul>
      </section>
      <section className="dashboard-sidenav__section">
        <p className="dashboard-sidenav__subtitle">Knowledge Center</p>
        <ul>
          <li>
            <a href="#learn-by-example">Learn by example</a>
          </li>
          <li>
            <a href="#quick-start-guide">Quick start guide</a>
          </li>
          <li>
            <a href="#get-in-touch">Get in touch</a>
          </li>
        </ul>
      </section>
    </aside>
  );
};

const RecentScenarioCard = () => {
  return <p>Use scenario card from ScenarioCard.jsx</p>;
};

const AuthoringPermissionsNote = () => {
  return (
    <div className="dashboard-cta">
      <p>
        Cohorts and scenario creation is only available to authors. Get in touch
        with the Teacher Moments team by filling out our request form to become
        an author.
      </p>
      <a
        className="dashboard-card__link"
        href="https://forms.gle/qVDNxiD1yqrtDwMQ6"
      >
        Fill out request form →
      </a>
    </div>
  );
};

const RecentScenarios = () => {
  return (
    <section id="recent-scenarios">
      <div className="dashboard-subheader">
        <h2>Your most recent scenarios</h2>
        <Button
          icon
          primary
          labelPosition="left"
          name="Create a new cohort"
          size="small"
          href="/"
          as="a"
        >
          <Icon name="add" />
          Create a new scenario
        </Button>
        <Button size="small" href="/scenarios">
          View all scenarios
        </Button>
      </div>
      <div className="dashboard-empty">
        <p>
          No scenarios created. <a href="#">Create a new scenario.</a>
        </p>
      </div>
      <ul className="dashboard-grid">
        <li>
          <RecentScenarioCard />
        </li>
      </ul>
    </section>
  );
};

const CardActions = () => {
  return (
    <div className="dashboard-button-group">
      <Button tabIndex="0" aria-label="Run scenario" size="tiny" icon as={Link}>
        <Icon name="play" className="primary" />
        <span>Run</span>
      </Button>
      <Button
        tabIndex="0"
        size="tiny"
        icon
        as={Link}
        aria-label="Copy scenario"
      >
        <Icon name="copy outline" className="primary" />
        <span>Copy</span>
      </Button>
    </div>
  );
};

const LearnByExample = () => {
  return (
    <section id="learn-by-example">
      <div className="dashboard-subheader">
        <h2>Learn by example</h2>
        <p>
          Run or copy example scenarios created by the team to learn all the
          features of Teacher Moments.
        </p>
      </div>
      <ul className="dashboard-grid">
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Robotic Fire Engine</p>
            <p>
              Tackles complex equity issues with a relatively simple structure,
              using just a few different authoring tools.
            </p>
            <CardActions />
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Roster Justice</p>
            <p>
              Uses video to simulate an authentic conversation about inequitable
              participation in computer science education.
            </p>
            <CardActions />
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Jeremy’s Journal</p>
            <p>
              Analyzes participants’ responses and offers suggestions and
              reflection questions to learners who need them in real time.
            </p>
            <CardActions />
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">
              Discussion Leader - Genetic Modifications in Humans
            </p>
            <p>
              Showcases the “choose your own adventure” capabilities of the
              platform; participants go down different paths.
            </p>
            <CardActions />
          </Card>
        </li>
      </ul>
    </section>
  );
};

const QuickStartGuide = () => {
  return (
    <section id="quick-start-guide">
      <div className="dashboard-subheader">
        <h2>Quick start guide</h2>
        <p>Onboard onto Teacher Moments using with step-by-step decks.</p>
      </div>
      <ol className="dashboard-grid dashboard-grid--numbered">
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">
              What are digital clinical simulations?
            </p>
            <p>An overview of Teacher Moments and ELK</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1671Hfy4dIOjfPRrEr_-MWh_XRB7uZ2ACPiS8v1HWng4/edit#slide=id.gf16183f65e_0_54"
            >
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Authoring a scenario</p>
            <p>How to develop a basic scenario in Teacher Moments</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1GgTQMwtcYWYHzWjzQYdEtN3RiUCn8aF7NPn-6Eb7N6c/edit#slide=id.p"
            >
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">
              Authoring the Different Components
            </p>
            <p>How to incorporate different components on slides</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1ySgJiD-jiKY68pQhvctL9qwc1ikwtAcFcFPXWUh0OY4/edit?usp=sharing"
            >
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Authoring in more details</p>
            <p>A more detailed look at authoring scenarios for one player</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1UH8YRz1pvZE4hPkLXUmMaahbziVGsfpSXCQ3P-QgeeM/edit#slide=id.gf8c678fc5f_0_54"
            >
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Teaching with simulations</p>
            <p>
              How to use responses from your cohort to facilitate discussion
            </p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1sKfDO0J6t4uxYWM-Bi1r_UJifPFOG1u_1U2hHEVsuzc/edit?usp=sharing"
            >
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Creating a cohort</p>
            <p>How to manage your classroom and discussions with cohorts.</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1QM32ZAxT-NtRM7aInkqB7DKRweOWyQwluqgd79m352I/edit#slide=id.gf325c6b0ac_0_108"
            >
              Go to guide →
            </a>
          </Card>
        </li>
      </ol>
      <div className="dashboard-cta">
        <p>
          Learn more about deeper features like branching and multiplayer
          scenarios in our resource center.
        </p>
        <a className="dashboard-card__link" href="#">
          Go to resource center →
        </a>
      </div>
    </section>
  );
};

const GetInTouch = () => {
  return (
    <section id="get-in-touch">
      <div className="dashboard-subheader">
        <h2>Get in touch</h2>
      </div>
      <div className="dashboard-cta">
        <p>
          Email us at{' '}
          <a href="mailto:teachermoments@mit.edu">teachermoments@mit.edu</a> for
          any questions using Teacher Moments or to join our regular community
          events for synchronous learning.
        </p>
      </div>
    </section>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>
      <div className="dashboard-container">
        <SideNav />
        <div className="dashboard-main">
          {/*Show this when a user is not an author*/}
          <AuthoringPermissionsNote />

          <RecentCohorts />
          <RecentScenarios />
          <LearnByExample />
          <QuickStartGuide />
          <GetInTouch />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
