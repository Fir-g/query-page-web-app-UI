'use client';

import { useStore } from '@/lib/store';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TableRowData {
  [key: string]: string | number | null;
}

export default function ChatPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const datasetId = searchParams.get('dataset');
  const datasetName = searchParams.get('name');

  const { messages, chatSessions, addChatMessage, setCurrentChat } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (id && datasetId && datasetName) {
      // Initialize chat session if it doesn't exist
      if (!chatSessions.find(chat => chat.id === Number(id))) {
        setCurrentChat(Number(id), Number(datasetId), decodeURIComponent(datasetName));
      }
    }
  }, [id, datasetId, datasetName, chatSessions, setCurrentChat]);

  const currentMessages = messages[Number(id)] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    addChatMessage(Number(id), {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    });

    // Simulate AI response
    setTimeout(() => {
      addChatMessage(Number(id), {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Here are the results based on your query:',
        timestamp: new Date().toISOString(),
        tableData: [
          { month: 'January', sales: 40000 },
          { month: 'February', sales: 35000 },
          { month: 'March', sales: 45000 },
        ] as TableRowData[],
        chartData: {
          type: 'bar',
          data: [40000, 35000, 45000],
          labels: ['January', 'February', 'March'],
        },
      });
    }, 1000);

    setQuery('');
  };

  return (
    <div className="container mx-auto py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Chat with {decodeURIComponent(datasetName || '')}
        </h1>
      </div>

      <ScrollArea className="flex-1 p-4 border rounded-lg mb-4">
        <div className="space-y-4">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                  }`}
              >
                <p className="mb-2">{message.content}</p>

                {/* Render Table if exists */}
                {message.tableData && message.tableData.length > 0 && (
                  <div className="bg-background rounded-lg p-2 mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(message.tableData[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {message.tableData.map((row, i) => (
                          <TableRow key={i}>
                            {Object.values(row).map((value, j) => (
                              <TableCell key={j}>
                                {typeof value === 'string' || typeof value === 'number'
                                  ? value
                                  : value !== null && value !== undefined
                                    ? JSON.stringify(value)
                                    : '—'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Render Chart if exists */}
                {message.chartData && message.chartData.labels.length > 0 && (
                  <div className="bg-background rounded-lg p-2 mt-2">
                    <BarChart
                      width={500}
                      height={300}
                      data={message.chartData.labels.map((label, i) => ({
                        name: label,
                        value: message.chartData!.data[i],
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your query..."
          className="flex-1"
        />
        <Button type="submit">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
