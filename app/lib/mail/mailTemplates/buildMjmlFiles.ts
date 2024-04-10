const fs = require('fs');

const mailTemplate: string = fs.readFileSync(
  'app/lib/mail/mailTemplates/mail-template.mjml',
  'utf8'
);

buildTemplate('support-mail');
buildTemplate('reset-password-mail');

function buildTemplate(targetFileName: string) {
  const template: string = fs.readFileSync(
    'app/lib/mail/mailTemplates/' + targetFileName + '.mjml',
    'utf8'
  );
  fs.writeFile(
    'app/lib/mail/mailTemplates/build/' + targetFileName + '.mjml',
    mailTemplate.replace('${additionalContent}', template),
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error(err);
      }
    }
  );
}
