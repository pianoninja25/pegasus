'use client'

import { useAuth } from '../../../context/auth-context';
import { useRouter } from 'next/navigation';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    // If there's no user, redirect to login page
    router.push('/login');
    return null;
  }

  if (!roles.includes(user.role)) {
    // If user role is not allowed, redirect to an access denied page or home
    router.push('/403');
    return null;
  }

  return children;
};

export default PrivateRoute;
