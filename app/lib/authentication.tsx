import React, { createContext, useEffect, useState } from 'react';

export interface UserType {
  token: string | null;
  name: string | null;
  company: string | null;
  address: string | null;
  zipCode: string | null;
  country: string | null;
  website: string | null;
  email: string;
  apiKeyValidUntil: Date | null;
  apiKey: string;
}
export interface UserContextType {
  user: UserType | undefined;
  login: (user: UserType) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: any }) {
  const [_user, setUser] = useState<UserType | undefined>(undefined);
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
  }
  return (
    <UserContext.Provider value={{ user: _user, login, logout }}>{children}</UserContext.Provider>
  );
}

function readUserToCookie(): UserType | undefined {
  const nameEQ = 'user=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) {
      return JSON.parse(c.substring(nameEQ.length, c.length)) as UserType;
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
