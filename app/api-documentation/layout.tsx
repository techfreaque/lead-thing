import React from 'react';
import DocsSideBar from '../components/DocsSideBar/DocsSideBar';

import '@mantine/code-highlight/styles.css';

// export const metadata = {
//   title: APP_NAME,
//   description:
//     'Get a unified and simplified API interface to create leads on many newsletter systems.',
// };

export default function RootLayout({ children }: { children: any }) {
  return <DocsSideBar currentPageName="test">{children}</DocsSideBar>;
}
