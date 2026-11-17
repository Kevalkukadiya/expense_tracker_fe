import { z } from 'zod';
import { SUPPORTED_CURRENCY_CODES } from '../utils/constants';

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,50}$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

export const registerSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(NAME_REGEX, 'First name can only contain letters, spaces, and hyphens'),

  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(NAME_REGEX, 'Last name can only contain letters, spaces, and hyphens'),

  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(100, 'Email cannot exceed 100 characters'),

  phone_number: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(PHONE_REGEX, 'Please enter a valid phone number (e.g. +1 555-123-4567)'),

  currency: z
    .string()
    .min(1, 'Please select your preferred currency')
    .refine(
      (val) => SUPPORTED_CURRENCY_CODES.includes(val),
      'Please select a valid supported currency'
    ),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
    .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (e.g. !@#$%^&*)'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),

  password: z.string().min(1, 'Password is required'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
