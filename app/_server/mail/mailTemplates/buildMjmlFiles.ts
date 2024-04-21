const fs = require('fs');

const mailTemplate: string = fs.readFileSync(
  'app/_server/mail/mailTemplates/mail-template.mjml',
  'utf8'
);

buildTemplate('support-mail');
buildTemplate('reset-password-mail');

function buildTemplate(targetFileName: string) {
  const template: string = fs.readFileSync(
    `app/_server/mail/mailTemplates/${targetFileName}.mjml`,
    'utf8'
  );
  fs.writeFile(
    `app/_server/mail/mailTemplates/build/${targetFileName}.mjml`,
    // eslint-disable-next-line no-template-curly-in-string
    mailTemplate.replace('${additionalContent}', template),
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        throw new Error(`${err}`);
      }
    }
  );
}
