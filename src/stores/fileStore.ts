import { create } from 'zustand';

interface File {
  path: string;
  name: string;
  content: string;
}

interface FileStore {
  files: File[];
  selectedFile: File | null;
  setFiles: (files: File[]) => void;
  setSelectedFile: (file: File) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [
    { path: 'index.ts', name: 'index.ts', content: '' },
    { path: 'types.ts', name: 'types.ts', content: '' }
  ],
  selectedFile: null,
  setFiles: (files) => set({ files }),
  setSelectedFile: (file) => set({ selectedFile: file })
}));