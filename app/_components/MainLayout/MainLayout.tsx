'use client';

import { UserProvider } from '@/app/_context/authentication';

import ContentContainer from '../ContentContainer/ContentContainer';
import Footer from '../Footer/Footer';
import Navbar from '../NavBar/NavBar';

export default function MainLayout({ children }: { children: any }) {
  return (
    <UserProvider>
      <Navbar />
      <ContentContainer>{children}</ContentContainer>
      <Footer />
    </UserProvider>
  );
}
