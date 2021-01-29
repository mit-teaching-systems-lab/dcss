const Sendgrid = require('@sendgrid/mail');
const Nodemailer = require('nodemailer');

const { asyncMiddleware } = require('../../util/api');

if (process.env.SENDGRID_API_KEY) {
  Sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

const brandTitle = process.env.DCSS_BRAND_NAME_TITLE || '';

exports.sendMailMessage = async message => {
  /*
    message

    {
      to: email,
      from: `${brandTitle} <${process.env.SENDGRID_SENDER}>`,
      subject,
      text,
      html
    }
  */

  let sent = true;
  let reason = '';

  if (process.env.SENDGRID_API_KEY) {
    try {
      await Sendgrid.send(message);
    } catch (error) {
      sent = false;
      reason = error.message;
    }
  } else {
    // TODO: can this be lifted out?
    const transport = Nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    try {
      await transport.sendMail(message);
    } catch (error) {
      sent = false;
      reason = error.message;
    }
  }

  return {
    sent,
    reason
  };
};

async function sendMailMessageAndRespond(req, res) {
  const { message } = req.body;
  const { sent, reason } = await exports.sendMailMessage(message);

  return res.json({
    sent,
    reason
  });
}

exports.sendMailMessageAndRespond = asyncMiddleware(sendMailMessageAndRespond);
