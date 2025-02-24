'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AdminPage() {
  const { users, toggleUserStatus } = useStore();
  const [usageLimits, setUsageLimits] = useState<Record<number, string>>({});

  const handleLimitChange = (userId: number, value: string) => {
    setUsageLimits((prev) => ({ ...prev, [userId]: value }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage Limit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={usageLimits[user.id] || ''}
                    onChange={(e) => handleLimitChange(user.id, e.target.value)}
                    placeholder="Set limit"
                    className="w-32"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={user.status === 'Active'}
                      onCheckedChange={() => toggleUserStatus(user.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Save usage limit
                        console.log(`Saving limit for user ${user.id}: ${usageLimits[user.id]}`);
                      }}
                    >
                      Save Limit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}