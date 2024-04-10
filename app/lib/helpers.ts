import bcrypt from 'bcryptjs';

export function encryptPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}
