import { RedirectType, redirect } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';
import { loginPath } from '../_lib/constants';

export interface UserType {
  token?: string | null;
  name: string | null;
  company: string | null;
  address: string | null;
  zipCode: string | null;
  country: string | null;
  website: string | null;
  email: string;
  apiKey: string;
  resetPasswordToken: string | null;
  resetPasswordTokenTime: Date | null;
}
export interface UserContextType {
  user: UserType | undefined;
  login: (user: UserType) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: any; }) {
  const [_user, setUser] = useState<UserType | undefined>(undefined);
  const [justLoggedOut, setJustLoggedout] = useState<boolean>(false);
  function login(user: UserType) {
    saveUserToCookie(user);
    setUser(user);
  }
  useEffect(() => {
    const userFromCookie = readUserToCookie();
    if (userFromCookie) {
      setUser(userFromCookie);
    }
  }, []);
  function logout() {
    eraseUserCookie();
    setUser(undefined);
    setJustLoggedout(true);
  }
  useEffect(() => {
    justLoggedOut && redirect(loginPath, RedirectType.push);
    setJustLoggedout(false);
  }, [justLoggedOut]);
  return (
    <UserContext.Provider value={{ user: _user, login, logout }}>{children}</UserContext.Provider>
  );
}

function readUserToCookie(): UserType | undefined {
  const nameEQ = 'user=';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
    if (cookie.indexOf(nameEQ) === 0) {
      return JSON.parse(cookie.substring(nameEQ.length, cookie.length)) as UserType;
    }
  }
  return undefined;
}

function eraseUserCookie() {
  document.cookie = 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
}

function saveUserToCookie(user: UserType) {
  const days = 1;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `user=${JSON.stringify(user) || ''}${expires}; path=/; SameSite=Strict`;
}
