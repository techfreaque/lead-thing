import { Suspense } from 'react';

import Signup from '@/app/_components/Signup/Signup';

export default function SignupPage() {
  return (
    <Suspense>
      <Signup type="register" />
    </Suspense>
  );
}
