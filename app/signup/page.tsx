import Signup from '@/app/components/Signup/Signup';
import { Suspense } from 'react';

export default function SignupPage() {
  return (
    <Suspense>
      <Signup type="register" />
    </Suspense>
  );
}
