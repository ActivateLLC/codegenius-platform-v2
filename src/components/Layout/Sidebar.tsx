import React from 'react';
import { FileTree } from '../FileExplorer/FileTree';

export const Sidebar = () => {
  return (
    <div className="w-64 border-r border-gray-700 bg-gray-800 p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">CodeGenius</h2>
      </div>
      <FileTree />
    </div>
  );
};