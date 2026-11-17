import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Button, Input, Card, CardBody, Alert } from '../ui';
import { loginSchema, type LoginSchemaType } from '../../validations/authValidation';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../services/apiClient';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setApiError(null);
    setApiSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      setApiSuccess(response.message || 'Login successful! Redirecting...');

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = getApiErrorMessage(err);
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardBody>
        {apiSuccess && (
          <div className="mb-6">
            <Alert
              variant="success"
              title="Welcome Back!"
              message={apiSuccess}
            />
          </div>
        )}

        {apiError && (
          <div className="mb-6">
            <Alert
              variant="error"
              title="Authentication Failed"
              message={apiError}
              onClose={() => setApiError(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            required
            startIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            showPasswordToggle
            startIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<LogIn className="h-4 w-4" />}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Don&apos;t have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
