import getConfig from 'next/config';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import fs from 'fs';
import { APP_NAME } from '@/app/_lib/constants';

const { serverRuntimeConfig } = getConfig();

export async function sendEmail({
  to,
  subject,
  html,
  toUsAsWell = false,
}: {
  to: string;
  subject: string;
  html: string;
  toUsAsWell?: boolean;
}): Promise<{
  customerMessageTransporter: SMTPTransport.SentMessageInfo;
  supportMessageTransporter?: SMTPTransport.SentMessageInfo;
}> {
  'use server';

  const transporter = createTransport({
    host: serverRuntimeConfig.SEND_EMAIL_HOST,
    port: serverRuntimeConfig.SEND_EMAIL_PORT,
    auth: {
      user: serverRuntimeConfig.SEND_EMAIL_USERNAME,
      pass: serverRuntimeConfig.SEND_EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false }, // TODO remove when mail server fixed
  });

  return {
    customerMessageTransporter: await transporter.sendMail({
      from: `${APP_NAME} <${serverRuntimeConfig.SEND_EMAIL}>`,
      to,
      subject,
      html,
    }),
    ...(toUsAsWell
      ? {
        supportMessageTransporter: await transporter.sendMail({
          from: `${APP_NAME} <${serverRuntimeConfig.SEND_EMAIL}>`,
          to: serverRuntimeConfig.SEND_EMAIL,
          subject,
          html,
          replyTo: to,
        }),
      }
      : {}),
  };
}

export function getMailTemplateFile(fileName: string): string {
  return fs.readFileSync(`app/_server/mail/mailTemplates/build/${fileName}.html`, 'utf8');
}
