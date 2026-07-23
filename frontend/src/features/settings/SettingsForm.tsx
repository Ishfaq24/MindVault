import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { authService } from '../../services/authService';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { User, Lock, LogOut, ShieldAlert, KeyRound, Check, Sun, Moon, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Current password must be at least 6 characters'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your new password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword'],
  });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const SettingsForm: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePasswordSubmit = async (data: ChangePasswordSchema) => {
    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    try {
      await authService.logoutAllDevices();
      toast.success('Signed out from all active sessions');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* User Profile Overview */}
      <Card className="p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">User Profile Information</h3>
            <p className="text-xs text-slate-500">Your account identity in MindVault OS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-500">Name</label>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{user?.name}</p>
          </div>
          <div>
            <label className="font-semibold text-slate-500">Email Address</label>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Theme & Display Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Appearance & Visual Theme</h3>
            <p className="text-xs text-slate-500">Saved to local storage and preserved across sessions</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Interface Theme</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Soft Blue & White Light Theme Card */}
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                toast.success('Soft Blue & White Light theme active');
              }}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                theme === 'light'
                  ? 'border-sky-500 bg-sky-50/60 shadow-xs ring-2 ring-sky-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-600">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  Soft Blue & White
                  {theme === 'light' && <Check className="w-4 h-4 text-sky-600" />}
                </p>
                <p className="text-[11px] text-slate-500">Light, airy soft blue accents with clean white canvas</p>
              </div>
            </button>

            {/* Dark Theme Card */}
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                toast.success('Dark theme active');
              }}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                theme === 'dark'
                  ? 'border-sky-500 bg-slate-900 text-white shadow-xs ring-2 ring-sky-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800 text-sky-400">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  Slate Dark Mode
                  {theme === 'dark' && <Check className="w-4 h-4 text-sky-400" />}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Deep slate canvas with soft blue highlights</p>
              </div>
            </button>
          </div>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Change Security Password</h3>
            <p className="text-xs text-slate-500">Update your access credentials</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onChangePasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.oldPassword?.message}
            {...register('oldPassword')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isChangingPassword}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-rose-200/60 dark:border-rose-900/50">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">Danger Zone</h3>
            <p className="text-xs text-rose-700 dark:text-rose-400">
              Manage active authorization tokens and session invalidation
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Revoke All Device Sessions</p>
            <p className="text-[11px] text-slate-500">Sign out across mobile, desktop, and other browsers</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowLogoutAllModal(true)}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Revoke All Sessions
          </Button>
        </div>
      </div>

      {/* Logout All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutAllModal}
        onClose={() => setShowLogoutAllModal(false)}
        onConfirm={handleLogoutAll}
        title="Revoke All Sessions"
        message="Are you sure you want to sign out from all devices? You will need to log in again on this device."
        confirmLabel="Revoke All"
        isLoading={isLoggingOutAll}
      />
    </div>
  );
};
