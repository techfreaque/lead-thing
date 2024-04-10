import { Suspense } from 'react';
import Signup from '../components/Signup/Signup';

export default function LoginPage() {
  return (
    <Suspense>
      <Signup type="login" />
    </Suspense>
  );
}
