import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import classes from './NavBar.module.css';
import Link from 'next/link';
import { apiDocsPath, mySubscriptionUrl, registerPath, supportedSystems } from '@/app/constants';
import Logo from '../Logo/Logo';
import NavBarUserButtons from './NavBarUserButtons';
import { useContext } from 'react';
import { UserContext, UserContextType } from '@/app/lib/authentication';

export default function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { user } = useContext(UserContext) as UserContextType;

  const links = supportedSystems.map((item) => (
    <Link
      key={item.label}
      href={item.link}
      style={{
        marginTop: 'auto',
        marginBottom: 'auto',
        textDecoration: 'none',
        color: 'unset',
      }}
    >
      <UnstyledButton className={classes.subLink}>
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={25} variant="transparent" radius="md">
            <item.icon style={{ width: rem(22), height: rem(22) }} />
          </ThemeIcon>
          <Text size="sm" fw={500}>
            {item.label}
          </Text>
        </Group>
      </UnstyledButton>
    </Link>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Logo />
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href={'/'} className={classes.link}>
              Home
            </Link>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Supported Systems
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Supported Systems</Text>
                  {/* <Link href={apiDocsPath} style={{ textDecoration: 'none' }}>
                    <Anchor fz="xs" component="button">
                      View all
                    </Anchor>
                  </Link> */}
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Its free, easy and just takes two minutes!
                      </Text>
                    </div>
                    <Link href={user ? mySubscriptionUrl : registerPath}>
                      <Button variant="default">Get started</Button>
                    </Link>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <Link href={apiDocsPath} className={classes.link}>
              API Documentation
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <NavBarUserButtons />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href="/" className={classes.link}>
            Home
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Supported Systems
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Link href={apiDocsPath} className={classes.link}>
            API Documentation
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <NavBarUserButtons />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
