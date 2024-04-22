'use client';

import { CSSProperties, ForwardRefExoticComponent, RefAttributes, useContext } from 'react';
import { IconKey, IconReceipt2, IconLogout, IconProps, Icon } from '@tabler/icons-react';
import Link from 'next/link';
import { Divider, Title } from '@mantine/core';
import classes from './DocsSideBar.module.css';
import { UserContext, UserContextType } from '@/app/_context/authentication';
import { myApiKeyUrl, mySubscriptionUrl } from '@/app/_lib/constants';
import { NewsletterSystem, newsletterSystems } from '@/app/api/newsletterSystemConstants';
import { getNewsletterSystemDocsUrl } from '@/app/_lib/helpers';

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
    name: string;
    icon: ForwardRefExoticComponent<Omit<IconProps, 'ref'> & RefAttributes<Icon>>;
    onClick?: () => void;
  }[] = [{ link: myApiKeyUrl, name: 'My API Key & Stats', icon: IconKey }];
  if (user) {
    items.unshift({ link: mySubscriptionUrl, name: 'My Subscription', icon: IconReceipt2 });
    items.push({ link: '#', onClick: logout, name: 'Logout', icon: IconLogout });
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
          <SideBarItems active={currentPageName} items={Object.values(newsletterSystems)} />
        </div>
      </nav>
      <main className={classes.main}>{children}</main>
    </div>
  );
}

interface sideBarItem {
  name: string;
  link?: string;
  onClick?: () => void;
  icon: ({
    style,
    className,
  }: {
    style?: CSSProperties | undefined;
    className?: string | undefined;
  }) => JSX.Element | any;
}

function SideBarItems({ items, active }: { items: sideBarItem[]; active: string }) {
  return items.map((item) => (
    <Link
      className={classes.link}
      data-active={item.name.toLowerCase().replace(/ /g, '-') === active || undefined}
      href={item.link ? item.link : getNewsletterSystemDocsUrl(item as NewsletterSystem)}
      onClick={item.onClick}
      key={item.name}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.name}</span>
    </Link>
  ));
}
