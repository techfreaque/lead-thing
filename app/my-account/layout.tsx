import React from 'react';
import DocsSideBar from '../components/DocsSideBar/DocsSideBar';

export default function RootLayout({ children }: { children: any; }) {
  return <DocsSideBar currentPageName="test">{children}</DocsSideBar>;
}
