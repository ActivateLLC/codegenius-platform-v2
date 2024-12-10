import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';

type AnalysisResult = {
  complexity: number;
  suggestions: string[];
  security: string[];
  performance: string[];
};

export const CodeAnalysis = () => {
  const { code } = useEditorStore();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-l border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Code Analysis</h3>
        <button
          onClick={analyzeCode}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {analysis && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Complexity Score</h4>
            <div className="text-2xl font-bold">{analysis.complexity}</div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Security Issues</h4>
            <ul className="list-disc pl-4 space-y-1">
              {analysis.security.map((issue, i) => (
                <li key={i} className="text-yellow-400">{issue}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Performance Insights</h4>
            <ul className="list-disc pl-4 space-y-1">
              {analysis.performance.map((insight, i) => (
                <li key={i} className="text-green-400">{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};