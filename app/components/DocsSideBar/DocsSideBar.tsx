'use client';
import { CSSProperties, ForwardRefExoticComponent, RefAttributes, useContext } from 'react';
import {
  IconBellRinging,
  IconKey,
  IconReceipt2,
  IconLogout,
  IconProps,
  Icon,
} from '@tabler/icons-react';
import classes from './DocsSideBar.module.css';
import { UserContext, UserContextType } from '@/app/lib/authentication';
import { myApiKeyUrl, supportedSystems } from '@/app/constants';
import Link from 'next/link';
import { Divider, Title } from '@mantine/core';

export default function DocsSideBar({
  children,
  currentPageName,
}: {
  children: any;
  currentPageName: string;
}) {
  const { user, logout } = useContext(UserContext) as UserContextType;
  const items: {
    link: string;
    label: string;
    icon: ForwardRefExoticComponent<Omit<IconProps, 'ref'> & RefAttributes<Icon>>;
    onClick?: () => void;
  }[] = [
    { link: '', label: 'Notifications', icon: IconBellRinging },
    { link: '', label: 'Billing', icon: IconReceipt2 },
    { link: myApiKeyUrl, label: 'My API Key', icon: IconKey },
    // { link: '', label: 'Security', icon: IconFingerprint },
    // { link: '', label: 'Databases', icon: IconDatabaseImport },
    // { link: '', label: 'Authentication', icon: Icon2fa },
    // { link: '', label: 'Other Settings', icon: IconSettings },
  ];
  if (user) {
    items.push({ link: '#', onClick: logout, label: 'Logout', icon: IconLogout });
  }
  return (
    <div style={{ display: 'flex' }}>
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Title order={3} mb={5}>
            My Account
          </Title>
          <SideBarItems active={currentPageName} items={items} />
          <Divider mt={10} mb={10} />
          <Title order={3} mt={10} mb={5}>
            API Docs
          </Title>
          <SideBarItems active={currentPageName} items={supportedSystems} />
        </div>
      </nav>
      <main className={classes.main}>{children}</main>
    </div>
  );
}

function SideBarItems({
  items,
  active,
}: {
  items: {
    icon: ({
      style,
      className,
    }: {
      style?: CSSProperties | undefined;
      className?: string | undefined;
    }) => JSX.Element | any;
    label: string;
    link: string;
    onClick?: () => void;
  }[];
  active: string;
}) {
  return items.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label.toLowerCase().replace(/ /g, '-') === active || undefined}
      href={item.link}
      onClick={item.onClick}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </Link>
  ));
}
