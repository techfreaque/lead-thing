const fs = require('fs')

const mailTemplate = fs.readFileSync('app/lib/mail/mailTemplates/mail-template.mjml', 'utf8');
const supportMail = fs.readFileSync('app/lib/mail/mailTemplates/support-mail.mjml', 'utf8');
fs.writeFile(
  'app/lib/mail/mailTemplates/build/support-mail.mjml',
  mailTemplate.replace('${additionalContent}', supportMail),
  (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  }
);
