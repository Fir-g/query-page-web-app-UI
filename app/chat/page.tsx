'use client';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

export default function ChatHistoryPage() {
  const { chatSessions } = useStore();
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Chat History</h1>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4">
          {chatSessions.map((chat) => (
            <Button
              key={chat.id}
              variant="outline"
              className="w-full p-4 h-auto"
              onClick={() => router.push(`/chat/${chat.id}`)}
            >
              <div className="flex flex-col items-start w-full">
                <div className="font-semibold">{chat.datasetName}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {chat.lastQuery}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(new Date(chat.timestamp), 'MMM d, yyyy')}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}