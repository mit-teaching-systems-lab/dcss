const INVITE_STATUS_MAP = {
  pending: 1,
  canceled: 2,
  declined: 3,
  accepted: 4,
  PENDING: 1,
  CANCELED: 2,
  DECLINED: 3,
  ACCEPTED: 4
};

const INVITE_STATUS_PENDING = 1;
const INVITE_STATUS_CANCEL = 2;
const INVITE_STATUS_DECLINE = 3;
const INVITE_STATUS_ACCEPT = 4;

const INVITE_STATUS_PENDING_NAME = 'pending';
const INVITE_STATUS_CANCEL_NAME = 'canceled';
const INVITE_STATUS_DECLINE_NAME = 'declined';
const INVITE_STATUS_ACCEPT_NAME = 'accepted';

const INVITE_STATUS_CANCELED_MESSAGE = 'This invitation has been canceled.';
const INVITE_STATUS_DECLINED_MESSAGE = 'This invitation has been declined.';
const INVITE_STATUS_ACCEPTED_MESSAGE = 'This invitation has been accepted.';

const INVITE_STATUS_MESSAGES_MAP = {
  '1': {
    received:
      'This invitation is pending. You may Accept, Decline or leave it unchanged.',
    sent: 'This invitation is pending. You may Cancel it or leave it unchanged'
  },
  '2': {
    received: INVITE_STATUS_CANCELED_MESSAGE,
    sent: INVITE_STATUS_CANCELED_MESSAGE
  },
  '3': {
    received: INVITE_STATUS_DECLINED_MESSAGE,
    sent: INVITE_STATUS_DECLINED_MESSAGE
  },
  '4': {
    received: INVITE_STATUS_ACCEPTED_MESSAGE,
    sent: INVITE_STATUS_ACCEPTED_MESSAGE
  }
};

export default {
  INVITE_STATUS_MAP,
  // Status Values
  INVITE_STATUS_PENDING,
  INVITE_STATUS_CANCEL,
  INVITE_STATUS_DECLINE,
  INVITE_STATUS_ACCEPT,
  INVITE_STATUS_PENDING_NAME,
  INVITE_STATUS_CANCEL_NAME,
  INVITE_STATUS_DECLINE_NAME,
  INVITE_STATUS_ACCEPT_NAME,

  // Messages
  INVITE_STATUS_MESSAGES_MAP,
  INVITE_STATUS_CANCELED_MESSAGE,
  INVITE_STATUS_DECLINED_MESSAGE,
  INVITE_STATUS_ACCEPTED_MESSAGE,
};
