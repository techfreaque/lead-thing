import { Suspense } from 'react';
import Signup from '@/app/components/Signup/Signup';

export default function SignupPage() {
  return (
    <Suspense>
      <Signup type="register" />
    </Suspense>
  );
}
