import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getMailTemplateFile, sendEmail } from './sendMail';
import { APP_DOMAIN, APP_NAME as _APP_NAME, resetPasswordPath } from '../../constants';

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
  return await sendEmail({
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
  const title = 'We received your request to reset your password';
  const message =
    'If you did not request a password reset, please make sure nobody has access to your mail inbox. In doubt change your email account password.';
  const name = _name;
  const APP_NAME = _APP_NAME;
  const passwordResetUrl = APP_DOMAIN + resetPasswordPath + '/' + resetPasswordToken;
  return eval('`' + mailTemplate.replace(/`/g, '`') + '`');
}
