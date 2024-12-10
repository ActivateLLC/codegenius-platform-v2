import { create } from 'zustand';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface AIStore {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
}

export const useAIStore = create<AIStore>((set, get) => ({
  messages: [],
  isLoading: false,
  sendMessage: async (content: string) => {
    set({ isLoading: true });
    const messages = [...get().messages, { role: 'user', content }];
    set({ messages });

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      
      const data = await response.json();
      set({
        messages: [...messages, { role: 'assistant', content: data.response }]
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));