'use client';

import { UserProvider } from '@/app/lib/authentication';
import Navbar from '../NavBar/NavBar';
import ContentContainer from '../ContentContainer/ContentContainer';
import Footer from '../Footer/Footer';

export default function MainLayout({ children }: { children: any; }) {
  return (
    <UserProvider>
      <Navbar />
      <ContentContainer>{children}</ContentContainer>
      <Footer />
    </UserProvider>
  );
}
