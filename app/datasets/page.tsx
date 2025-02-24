'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Pencil, MessageSquare } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function DatasetsPage() {
  const { datasets, addDataset, deleteDataset } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const router = useRouter();

  const handleAddDataset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDatasetName.trim()) return;

    const newDataset = {
      id: Date.now(),
      name: newDatasetName,
      uploadedAt: new Date().toISOString(),
    };

    addDataset(newDataset);
    setNewDatasetName('');
    setIsOpen(false);
  };

  const handleStartChat = (datasetId: number, datasetName: string) => {
    const chatId = Date.now();
    router.push(`/chat/${chatId}?dataset=${datasetId}&name=${encodeURIComponent(datasetName)}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Datasets</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Dataset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Dataset</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDataset} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Dataset Name
                </label>
                <Input
                  id="name"
                  value={newDatasetName}
                  onChange={(e) => setNewDatasetName(e.target.value)}
                  placeholder="Enter dataset name"
                />
              </div>
              <div>
                <label htmlFor="file" className="block text-sm font-medium mb-2">
                  Upload File
                </label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx"
                  className="cursor-pointer"
                />
              </div>
              <Button type="submit" className="w-full">
                Upload Dataset
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasets.map((dataset) => (
              <TableRow key={dataset.id}>
                <TableCell className="font-medium">{dataset.name}</TableCell>
                <TableCell>
                  {format(new Date(dataset.uploadedAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleStartChat(dataset.id, dataset.name)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteDataset(dataset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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