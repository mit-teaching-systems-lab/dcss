import React from 'react';
import { Button, Card, Icon } from '@components/UI';
import './Dashboard.css';

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

const RecentCohorts = () => {
  return (
    <section id="recent-cohorts">
      <div className="dashboard-subheader">
        <h2>Your most recent cohorts</h2>
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
          Create a new cohort
        </Button>
        <Button size="small" href="/">
          View all cohorts
        </Button>
      </div>
    </section>
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
    </section>
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
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Roster Justice</p>
            <p>
              Uses video to simulate an authentic conversation about inequitable
              participation in computer science education.
            </p>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Jeremy’s Journal</p>
            <p>
              Analyzes participants’ responses and offers suggestions and
              reflection questions to learners who need them in real time.
            </p>
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
            <a className="dashboard-card__link" href="#">
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Authoring a scenario</p>
            <p>How to develop a basic scenario in Teacher Moments</p>
            <a className="dashboard-card__link" href="#">
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
            <a className="dashboard-card__link" href="#">
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Authoring in more details</p>
            <p>A more detailed look at authoring scenarios for one player</p>
            <a className="dashboard-card__link" href="#">
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
            <a className="dashboard-card__link" href="#">
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Creating a cohort</p>
            <p>How to manage your classroom and discussions with cohorts.</p>
            <a className="dashboard-card__link" href="#">
              Go to guide →
            </a>
          </Card>
        </li>
      </ol>
    </section>
  );
};

const GetInTouch = () => {
  return (
    <section id="get-in-touch">
      <div className="dashboard-subheader">
        <h2>Get in touch</h2>
        <p>
          Get in touch with the Teaching Systems Lab to learn more about events
          and synchronous learning.
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
