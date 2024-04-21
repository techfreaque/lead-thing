import React from 'react';
import DocsSideBar from '../_components/DocsSideBar/DocsSideBar';

import '@mantine/code-highlight/styles.css';

export default function RootLayout({ children }: { children: any; }) {
  return <DocsSideBar currentPageName="test">{children}</DocsSideBar>;
}
