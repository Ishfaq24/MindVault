import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/Avatar';
import { Dropdown, DropdownItem } from '../components/Dropdown';
import { User as UserIcon, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const menuItems: DropdownItem[] = [
    {
      id: 'settings',
      label: 'Account Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate('/settings'),
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => navigate('/settings'),
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: async () => {
        try {
          await logout();
          toast.success('Signed out successfully');
          navigate('/login');
        } catch {
          toast.error('Failed to sign out');
        }
      },
    },
  ];

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none">
          <Avatar name={user.name} size="sm" />
          <div className="hidden md:flex flex-col text-left pr-1">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
              {user.name}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate max-w-[120px]">
              {user.email}
            </span>
          </div>
        </div>
      }
      items={menuItems}
      align="right"
    />
  );
};
