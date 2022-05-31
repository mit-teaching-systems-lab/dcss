import { Container, Divider, Header, List, Segment } from '@components/UI';

import { BRAND_NAME } from '@utils/constants';
import React from 'react';

const QuickStartGuide = () => {
  return (
    <Container fluid id="quick-start-guide">
      <Header as="h2">Quick start guide</Header>
      <Header.Subheader className="dashboard-subheader">
        Learn to author and use {BRAND_NAME} scenarios.
      </Header.Subheader>
      <Divider />
      <List ordered className="dashboard-list">
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1671Hfy4dIOjfPRrEr_-MWh_XRB7uZ2ACPiS8v1HWng4/edit#slide=id.gf16183f65e_0_54"
          >
            What Is {BRAND_NAME}?
          </a>
          <p>An overview of {BRAND_NAME} and ELK</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1GgTQMwtcYWYHzWjzQYdEtN3RiUCn8aF7NPn-6Eb7N6c/edit#slide=id.p"
          >
            Authoring a Scenario
          </a>
          <p>How to develop a basic scenario in {BRAND_NAME}</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://drive.google.com/file/d/1fw3E_XsEe5a-nhRVTbeQp2Na-MAgiB0w/view?usp=sharing"
          >
            Authoring the Different Components
          </a>
          <p>How to incorporate different components on slides</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1ckqn2zyAiq-MU4hTGubZOUg5B--seK47qKjpdHWVjjs/edit?usp=sharing"
          >
            Authoring in More Detail
          </a>
          <p>A more detailed look at authoring scenarios for one player</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1QM32ZAxT-NtRM7aInkqB7DKRweOWyQwluqgd79m352I/edit#slide=id.gf325c6b0ac_0_108"
          >
            Creating a Cohort
          </a>
          <p>How to manage your classroom and discussions with cohorts</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1sKfDO0J6t4uxYWM-Bi1r_UJifPFOG1u_1U2hHEVsuzc/edit?usp=sharing"
          >
            Teaching with Simulations
          </a>
          <p>How to use responses from your cohort to facilitate discussion</p>
        </List.Item>
      </List>
      <Segment padded className="dashboard-cta">
        <p>
          Learn more about deeper features like branching and multiplayer
          scenarios in our resource center.
        </p>
        <a href="https://drive.google.com/drive/folders/1A3MxYpjPXSPndW3wMwAUXonZh6kFKYmG?usp=sharing">
          Go to resource center →
        </a>
      </Segment>
    </Container>
  );
};

export default QuickStartGuide;
