"use client";

import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { LogOut, User as UserIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold">DiveMix Admin Panel</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Website</span>
        </Link>
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}