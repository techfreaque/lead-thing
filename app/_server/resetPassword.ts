'use server';

import { v4 as uuidv4 } from 'uuid';
import { UserType } from '../_context/authentication';
import { encryptPassword } from '../_lib/helpers';
import sendPasswordResetMail from './mail/sendPasswordResetMail';
import { prisma } from './prisma';

export async function resetPassword(email: string): Promise<boolean> {
  const resetPasswordToken = uuidv4();
  const user = await setResetPasswordToken(email, resetPasswordToken);
  user && (await sendPasswordResetMail(user.name, email, resetPasswordToken));
  return true;
}

async function setResetPasswordToken(
  email: string,
  resetPasswordToken: string
): Promise<UserType | false> {
  try {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetPasswordToken,
        resetPasswordTokenTime: new Date(),
      },
    });
    return user;
  } catch (e) {
    return false;
  }
}

export async function isTokenValid(resetPasswordToken: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      resetPasswordToken,
    },
  });
  if (user?.resetPasswordTokenTime) {
    const validUntil = new Date(user.resetPasswordTokenTime);
    validUntil?.setHours(user.resetPasswordTokenTime.getHours() + 4);
    return Boolean(user) && validUntil > new Date();
  }
  return false;
}

export async function setPassword(password: string, resetPasswordToken: string): Promise<boolean> {
  try {
    const user = await prisma.user.update({
      where: {
        resetPasswordToken,
      },
      data: {
        password: encryptPassword(password),
        resetPasswordToken: null,
        resetPasswordTokenTime: null,
      },
    });
    return Boolean(user);
  } catch (e) {
    /* empty */
  }
  return false;
}
