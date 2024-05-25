import { Suspense } from 'react';

import Signup from '../_components/Signup/Signup';

export default function LoginPage() {
  return (
    <Suspense>
      <Signup type="login" />
    </Suspense>
  );
}
