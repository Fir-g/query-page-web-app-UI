import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

interface Dataset {
  id: number;
  name: string;
  uploadedAt: string;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tableData?: any[];
  chartData?: {
    type: 'bar' | 'line';
    data: number[];
    labels: string[];
  };
}

interface ChatSession {
  id: number;
  datasetId: number;
  datasetName: string;
  lastQuery: string;
  timestamp: string;
}

interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
  datasets: Dataset[];
  chatSessions: ChatSession[];
  currentChatId: number | null;
  messages: Record<number, ChatMessage[]>;
  users: User[];
  login: (email: string, password: string) => void;
  logout: () => void;
  addDataset: (dataset: Dataset) => void;
  deleteDataset: (id: number) => void;
  addChatMessage: (chatId: number, message: ChatMessage) => void;
  setCurrentChat: (chatId: number, datasetId: number, datasetName: string) => void;
  toggleUserStatus: (userId: number) => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  datasets: [
    { id: 1, name: "Sales Data Q1", uploadedAt: "2025-02-10" },
    { id: 2, name: "Customer Feedback", uploadedAt: "2025-02-12" },
    { id: 3, name: "Marketing Campaigns", uploadedAt: "2025-02-14" },
  ],
  chatSessions: [
    { id: 1, datasetId: 1, datasetName: "Sales Data Q1", lastQuery: "Show total sales", timestamp: "2025-02-15" },
    { id: 2, datasetId: 2, datasetName: "Customer Feedback", lastQuery: "Sentiment analysis", timestamp: "2025-02-16" },
  ],
  currentChatId: null,
  messages: {
    1: [
      {
        id: 1,
        type: 'user',
        content: 'Show me total sales',
        timestamp: '2025-02-15T10:00:00Z',
      },
      {
        id: 2,
        type: 'assistant',
        content: 'Here are the total sales for Q1 2025:',
        timestamp: '2025-02-15T10:00:01Z',
        tableData: [
          { month: 'January', sales: '$40,000' },
          { month: 'February', sales: '$35,000' },
          { month: 'March', sales: '$45,000' },
        ],
        chartData: {
          type: 'bar',
          data: [40000, 35000, 45000],
          labels: ['January', 'February', 'March'],
        },
      },
    ],
  },
  users: [
    { id: 1, name: "Alice Smith", email: "alice@example.com", status: "Active" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", status: "Inactive" },
  ],
  login: (email, password) => 
    set({ 
      isAuthenticated: true,
      currentUser: { id: 1, name: "Alice Smith", email, status: "Active" }
    }),
  logout: () => set({ isAuthenticated: false, currentUser: null }),
  addDataset: (dataset) => 
    set((state) => ({ datasets: [...state.datasets, dataset] })),
  deleteDataset: (id) => 
    set((state) => ({ datasets: state.datasets.filter(d => d.id !== id) })),
  addChatMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
      chatSessions: state.chatSessions.map(chat =>
        chat.id === chatId
          ? { ...chat, lastQuery: message.type === 'user' ? message.content : chat.lastQuery }
          : chat
      ),
    })),
  setCurrentChat: (chatId, datasetId, datasetName) => 
    set((state) => ({
      currentChatId: chatId,
      chatSessions: [
        ...state.chatSessions,
        {
          id: chatId,
          datasetId,
          datasetName,
          lastQuery: '',
          timestamp: new Date().toISOString(),
        },
      ],
    })),
  toggleUserStatus: (userId) =>
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
          : user
      ),
    })),
}));