const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const authdb = require('../auth/db');
const cohortdb = require('../cohorts/db');
const notificationdb = require('../notifications/db');
const scenariodb = require('../scenarios/db');

exports.makeChatInviteNotification = async (invite) => {
  const host = await authdb.getUserById(invite.sender_id);
  const chat = await db.getChatById(invite.chat_id);
  const scenario = await scenariodb.getScenarioById(chat.scenario_id);
  const cohort = chat.cohort_id
    ? await cohortdb.getCohortById(chat.cohort_id)
    : null;

  const hostname = host.personalname || host.username;
  const persona = scenario.personas.find(persona => persona.id === invite.persona_id);
  const inScenario = `the scenario <strong>${scenario.title}</strong>, as <strong>${persona.name}</strong>`;
  const place = cohort
    ? `${inScenario}, which is part of the cohort <strong>${cohort.name}</strong>`
    : inScenario;

  const html = `<strong>${hostname}</strong> has invited you to join them in ${place}.`;

  return {
    start_at: invite.created_at,
    expire_at: invite.expire_at,
    props: {
      title: 'New invitation!',
      html,
      className: '',
      color: '',
      icon: 'mail',
      time: 0
    },
    rules: { 'session.isLoggedIn': true, 'user.id': invite.receiver_id },
    type: 'invite',
    invite
  };

  //
  // PREVIOUSLY:
  //
  // notificationdb.createNotification({
  //   start_at: data.created_at,
  //   expire_at: data.expire_at,
  //   props: {
  //     title: 'Invitation!',
  //     message:
  //       '{host} has invited you to join them in {scenario}. Follow this {link}.',
  //     className: '',
  //     type: 'info' ,
  //     color: 'pink',
  //     icon: '',
  //     size: 'small',
  //     time: 0
  //   },
  //   rules: { 'session.isLoggedIn': true, 'user.id': data.receiver_id },
  //   type: 'toast'
  // });
};
