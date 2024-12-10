import React from 'react';
import { useFileStore } from '../../stores/fileStore';

export const FileTree = () => {
  const { files, selectedFile, setSelectedFile } = useFileStore();

  return (
    <div className="text-gray-300">
      <div className="mb-2 text-sm font-semibold uppercase">Files</div>
      <div className="space-y-1">
        {files.map((file) => (
          <div
            key={file.path}
            className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-700 ${
              selectedFile?.path === file.path ? 'bg-gray-700' : ''
            }`}
            onClick={() => setSelectedFile(file)}
          >
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
};