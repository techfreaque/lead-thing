import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getMailTemplateFile, sendEmail } from './sendMail';
import { APP_NAME as _APP_NAME } from '../../_lib/constants';

export default async function sendNoQuotaLeftWarningMail(
  name: string | null,
  email: string,
): Promise<{
  customerMessageTransporter: SMTPTransport.SentMessageInfo;
}> {
  const _subject = 'Attention: Monthly Quota Reached';
  const mailWithData = getMailTemplate({
    name,
  });
  return sendEmail({
    to: email,
    subject: _subject,
    html: mailWithData,
    toUsAsWell: true,
  });
}

function getMailTemplate({
  name: _name,
}: {
  name: string | null;
}): string {
  const mailTemplate = getMailTemplateFile('mail-template');
  // all vars required by eval
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const title = 'Your usage has reached the monthly quota limit. To continue using our service seamlessly, please consider upgrading your plan.';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const message = '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const name = _name;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const APP_NAME = _APP_NAME;
  // eslint-disable-next-line no-eval
  return eval(`\`${mailTemplate.replace(/`/g, '`')}\``);
}
