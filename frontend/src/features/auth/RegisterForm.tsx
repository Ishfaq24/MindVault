import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsSubmitting(true);
    try {
      await registerAuth(data);
      toast.success('Account created successfully! Welcome to MindVault.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Alex Vance"
        leftIcon={<UserIcon className="w-4 h-4" />}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="alex@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-2"
        isLoading={isSubmitting}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Create MindVault Account
      </Button>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};
