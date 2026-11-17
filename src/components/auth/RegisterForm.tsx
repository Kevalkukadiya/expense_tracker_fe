import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Input, Select, Card, CardBody, Alert } from '../ui';
import { registerSchema, type RegisterSchemaType } from '../../validations/authValidation';
import { SUPPORTED_CURRENCIES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../services/apiClient';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      currency: '',
      password: '',
    },
  });

  const passwordValue = watch('password') || '';

  const passwordChecks = [
    { label: 'At least 8 characters', met: passwordValue.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(passwordValue) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(passwordValue) },
    { label: 'One number (0-9)', met: /[0-9]/.test(passwordValue) },
    { label: 'One special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const currencyOptions = SUPPORTED_CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.code} - ${c.name} (${c.symbol})`,
  }));

  const onSubmit = async (data: RegisterSchemaType) => {
    setApiError(null);
    setApiSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await registerAuth({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        currency: data.currency,
      });

      setApiSuccess(
        response.message || 'Account successfully created! Redirecting to login...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 1800);
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
              title="Registration Successful!"
              message={apiSuccess}
            />
          </div>
        )}

        {apiError && (
          <div className="mb-6">
            <Alert
              variant="error"
              title="Registration Failed"
              message={apiError}
              onClose={() => setApiError(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="first_name"
              label="First Name"
              placeholder="e.g. John"
              required
              startIcon={<User className="h-4 w-4" />}
              error={errors.first_name?.message}
              {...register('first_name')}
            />

            <Input
              id="last_name"
              label="Last Name"
              placeholder="e.g. Doe"
              required
              startIcon={<User className="h-4 w-4" />}
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="john.doe@example.com"
            required
            startIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="phone_number"
            type="tel"
            label="Phone Number"
            placeholder="+1 555-123-4567"
            required
            startIcon={<Phone className="h-4 w-4" />}
            error={errors.phone_number?.message}
            helperText="Include country code (e.g. +1, +44, +91)"
            {...register('phone_number')}
          />

          <Select
            id="currency"
            label="Preferred Currency"
            required
            placeholder="Choose your primary currency"
            startIcon={<DollarSign className="h-4 w-4" />}
            options={currencyOptions}
            error={errors.currency?.message}
            {...register('currency')}
          />

          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              required
              showPasswordToggle
              startIcon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs">
              <span className="font-semibold text-slate-700 block mb-1.5">
                Password must include:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {passwordChecks.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 transition-colors ${
                      item.met ? 'text-emerald-700 font-medium' : 'text-slate-500'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-3.5 w-3.5 shrink-0 ${
                        item.met ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
