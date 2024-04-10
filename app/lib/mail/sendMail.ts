import { APP_NAME } from '@/app/constants';
import getConfig from 'next/config';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const { serverRuntimeConfig } = getConfig();

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{
  customerMessageTransporter: SMTPTransport.SentMessageInfo;
  supportMessageTransporter: SMTPTransport.SentMessageInfo;
}> {
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
    supportMessageTransporter: await transporter.sendMail({
      from: `${APP_NAME} <${serverRuntimeConfig.SEND_EMAIL}>`,
      to: serverRuntimeConfig.SEND_EMAIL,
      subject,
      html,
      replyTo: to,
    }),
  };
}

// function getMailTemplate(
//   name: string,
//   title: string,
//   message: string,
//   additionalContent: string = ''
// ): string {
//   return mjml2html(
//     // edit @ https://mjml.io/try-it-live
//     `

//   `,
//     { minify: true, skeleton: undefined, mjmlConfigPath: undefined, useMjmlConfigOptions: false }
//   ).html;
// }
