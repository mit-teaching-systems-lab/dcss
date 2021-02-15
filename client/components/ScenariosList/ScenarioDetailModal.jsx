import React from 'react';
import PropTypes from 'prop-types';
import { Header, Modal } from '@components/UI';
import Moment from '@utils/Moment';
import Username from '@components/User/Username';
import ScenarioCardActions from './ScenarioCardActions';
import ScenarioLabels from './ScenarioLabels';
import Identity from '@utils/Identity';
import './ScenariosList.css';

const ScenarioDetailModal = ({ onClose, open, scenario }) => {
  const createdAt = Moment(scenario.created_at).fromNow();
  const createdAtAlt = Moment(scenario.created_at).calendar();
  const username = <Username user={scenario.author} />;
  const subheader = (
    <span title={createdAtAlt}>
      Created by {username} ({createdAt})
    </span>
  );

  const ariaLabelledby = Identity.id();
  const ariaDescribedby = Identity.id();
  return (
    <Modal.Accessible open={open}>
      <Modal
        closeIcon
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        centered={false}
        open={open}
        onClose={onClose}
      >
        <Header id={ariaLabelledby}>{scenario.title}</Header>
        <Modal.Content>
          {subheader}
          <ScenarioLabels scenario={scenario} />
        </Modal.Content>
        <Modal.Content id={ariaDescribedby}>
          <Modal.Description className="sc__modal-description">
            {scenario.description}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <ScenarioCardActions scenario={scenario} />
        </Modal.Actions>
      </Modal>
    </Modal.Accessible>
  );
};

ScenarioDetailModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  scenario: PropTypes.object
};

export default ScenarioDetailModal;
