import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { APP_DOMAIN, APP_NAME as _APP_NAME, resetPasswordPath } from '../../_lib/constants';
import { getMailTemplateFile, sendEmail } from './sendMail';

export default async function sendPasswordResetMail(
  name: string | null,
  email: string,
  resetPasswordToken: string
): Promise<{
  customerMessageTransporter: SMTPTransport.SentMessageInfo;
}> {
  const _subject = 'Reset your password';
  const mailWithData = getMailTemplate({
    name,
    resetPasswordToken,
  });
  return sendEmail({
    to: email,
    subject: _subject,
    html: mailWithData,
  });
}

function getMailTemplate({
  name: _name,
  resetPasswordToken,
}: {
  name: string | null;
  resetPasswordToken: string;
}): string {
  const mailTemplate = getMailTemplateFile('reset-password-mail');
  // all vars required by eval
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const title = 'We received your request to reset your password';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const message =
    'If you did not request a password reset, please make sure nobody has access to your mail inbox. In doubt change your email account password.';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const name = _name;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const APP_NAME = _APP_NAME;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const passwordResetUrl = `${APP_DOMAIN + resetPasswordPath}/${resetPasswordToken}`;
  // eslint-disable-next-line no-eval
  return eval(`\`${mailTemplate.replace(/`/g, '`')}\``);
}
