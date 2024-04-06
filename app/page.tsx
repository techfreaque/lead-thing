import HomeHero from '@/app/components/HomeHero/HomeHero';
import HomeFeatures from '@/app/components/HomeFeatures/HomeFeatures';
import GetInTouch from '@/app/components/GetInTouch/GetInTouch';
import Faq from '@/app/components/Faq/Faq';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeFeatures/>
      <Faq/>
      <GetInTouch/>
    </>
  );
}
