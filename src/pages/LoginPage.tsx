import { useEffect } from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Sign In - ExpenseTracker';
  }, []);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your expenses, categories, and financial analytics."
    >
      <LoginForm />
    </AuthLayout>
  );
}
