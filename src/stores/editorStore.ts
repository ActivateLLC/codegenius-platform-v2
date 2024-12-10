import { create } from 'zustand';

interface EditorStore {
  code: string;
  language: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  code: '',
  language: 'typescript',
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language })
}));