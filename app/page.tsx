import GetInTouch from '@/app/_components/GetInTouch/GetInTouch';
import HomeFeatures from '@/app/_components/HomeFeatures/HomeFeatures';
import HomeHero from '@/app/_components/HomeHero/HomeHero';

import SubscriptionTiersSection from './_components/SubscriptionTiers/SubscriptionTiers';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeFeatures />
      <SubscriptionTiersSection />
      {/* <Faq /> */}
      <GetInTouch />
    </>
  );
}
