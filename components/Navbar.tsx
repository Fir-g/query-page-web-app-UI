'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogOut, Database, MessageSquare, Settings } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const { isAuthenticated, currentUser, logout } = useStore();

  if (!isAuthenticated) return null;

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-semibold text-lg flex items-center gap-2">
          <Database className="h-6 w-6" />
          QueryAI
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/datasets" className="text-sm font-medium hover:text-primary">
            Datasets
          </Link>
          <Link href="/chat" className="text-sm font-medium hover:text-primary">
            Chat
          </Link>
          {currentUser?.status === 'Active' && (
            <Link href="/admin" className="text-sm font-medium hover:text-primary">
              Admin
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => logout()}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}