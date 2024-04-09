import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { sendEmail } from './sendMail';
import fs from 'fs';
import { APP_NAME as _APP_NAME } from '../../constants';

export default async function SendSupportMail(
  name: string,
  company: string | null,
  subject: string,
  country: string | null,
  website: string | null,
  email: string,
  message: string
): Promise<SMTPTransport.SentMessageInfo> {
  const _subject = 'Support request - ' + subject;
  const mailWithData = getMailTemplate({
    name,
    company,
    subject: _subject,
    country,
    website,
    supportMessage: message,
  });
  return await sendEmail({
    to: email,
    subject: _subject,
    html: mailWithData,
  });
}

function getMailTemplate({
  name: _name,
  company: _company,
  subject: _subject,
  country: _country,
  website: _website,
  supportMessage: _supportMessage,
}: {
  name: string;
  company: string | null;
  subject: string;
  country: string | null;
  website: string | null;
  supportMessage: string;
}): string {
  const supportMail = fs.readFileSync('app/lib/mail/mailTemplates/build/support-mail.html', 'utf8');
  // all vars required by eval
  const subject = _subject;
  const title = 'Thank you for your message!';
  const message = 'We received your request and will get back to you shortly.';
  const company = _company ? '<br/>Company: ' + _company : '';
  const country = _country ? '<br/>Country: ' + _country : '';
  const website = _website ? '<br/>Website: ' + _website : '';
  const name = _name;
  const supportMessage = _supportMessage;
  const APP_NAME = _APP_NAME;
  return eval('`' + supportMail.replace(/`/g, "\`") + '`');
}
