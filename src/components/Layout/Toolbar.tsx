import React from 'react';
import { useEditorStore } from '../../stores/editorStore';

export const Toolbar = () => {
  const { language, setLanguage } = useEditorStore();

  return (
    <div className="h-12 border-b border-gray-700 bg-gray-800 flex items-center px-4 justify-between">
      <div className="flex items-center space-x-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white rounded px-2 py-1"
        >
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600">
          Run
        </button>
        <button className="px-3 py-1 bg-green-500 rounded hover:bg-green-600">
          Save
        </button>
      </div>
    </div>
  );
};