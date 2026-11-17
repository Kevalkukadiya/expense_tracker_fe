import { useEffect } from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';

export default function RegisterPage() {
  useEffect(() => {
    document.title = 'Create Your Account - ExpenseTracker';
  }, []);

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join ExpenseTracker to easily manage your expenses, budgets, and finances."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
