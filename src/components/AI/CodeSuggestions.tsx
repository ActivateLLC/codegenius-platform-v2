import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';

export const CodeSuggestions = () => {
  const { code } = useEditorStore();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSuggestions = async () => {
      if (!code.trim()) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/ai/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error('Error getting suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 1000);
    return () => clearTimeout(timeoutId);
  }, [code]);

  if (!suggestions.length && !isLoading) return null;

  return (
    <div className="p-4 bg-gray-800 border-l border-gray-700">
      <h3 className="text-lg font-semibold mb-2">
        Suggestions {isLoading && '(Loading...)'}
      </h3>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};