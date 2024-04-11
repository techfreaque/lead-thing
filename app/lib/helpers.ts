import bcrypt from 'bcryptjs';
import { NewsletterSystem } from '../api/newsletterSystemConstants';
import { apiDocsPath } from '../constants';

export function encryptPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function getNewsletterSystemDocsUrl(newsletterSystem: NewsletterSystem): string {
  return apiDocsPath + newsletterSystem.path;
}
