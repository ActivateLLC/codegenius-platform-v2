import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';

type RefactoringOption = {
  title: string;
  description: string;
  code: string;
};

export const RefactoringSuggestions = () => {
  const { code, setCode } = useEditorStore();
  const [options, setOptions] = useState<RefactoringOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRefactoringOptions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      setOptions(data.options);
    } catch (error) {
      console.error('Refactoring error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyRefactoring = (newCode: string) => {
    setCode(newCode);
    setOptions([]);
  };

  return (
    <div className="p-4 bg-gray-800 border-l border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Refactoring Options</h3>
        <button
          onClick={getRefactoringOptions}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Get Suggestions'}
        </button>
      </div>

      <div className="space-y-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="p-3 bg-gray-700 rounded"
          >
            <h4 className="font-medium mb-1">{option.title}</h4>
            <p className="text-sm text-gray-300 mb-2">{option.description}</p>
            <button
              onClick={() => applyRefactoring(option.code)}
              className="text-sm px-2 py-1 bg-green-500 rounded hover:bg-green-600"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};