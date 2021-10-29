const { asyncMiddleware } = require('../../util/api');
const { query } = require('../../util/db');
const db = require('./db');
const authdb = require('../session/db');
const cohortdb = require('../cohorts/db');
const notificationdb = require('../notifications/db');
const scenariodb = require('../scenarios/db');

exports.makeChatInviteNotification = async invite => {
  const host = await authdb.getUserById(invite.sender_id);
  const chat = await db.getChat(invite.chat_id);

  if (!chat.scenario_id) {
    const result = await query(sql`
      SELECT scenario_id
      FROM scenario_persona
      WHERE scenario_persona = ${invite.persona_id}
    `);

    chat.scenario_id = result.rows.length ? result.rows[0].scenario_id : null;
  }

  const scenario = chat.scenario_id
    ? await scenariodb.getScenarioById(chat.scenario_id)
    : null;
  const cohort = chat.cohort_id
    ? await cohortdb.getCohortById(chat.cohort_id)
    : null;

  const hostname = host.personalname || host.username;
  const persona = scenario
    ? scenario.personas.find(persona => persona.id === invite.persona_id)
    : null;

  const asRole = persona ? `, as <strong>${persona.name}</strong>` : '';
  const inScenario = scenario ? `the scenario <strong>${scenario.title}</strong>${asRole}` : '';
  const place = cohort
    ? `${inScenario}, which is part of the cohort <strong>${cohort.name}</strong>`
    : inScenario;

  const joinIn = scenario ? ` in ${place}` : '';
  const html = `<strong>${hostname}</strong> has invited you to join them${joinIn}.`;

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
