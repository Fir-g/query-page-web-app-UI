'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogOut, Database } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { isAuthenticated, currentUser, logout } = useStore();
  const router = useRouter();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to home page after logout
  };

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
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
