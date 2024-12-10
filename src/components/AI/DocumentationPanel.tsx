import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { DocumentationConfig, generateDocumentation } from '../../lib/ai/documentationGenerator';

export const DocumentationPanel = () => {
  const { code } = useEditorStore();
  const [docs, setDocs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<DocumentationConfig>({
    includeExamples: true,
    format: 'markdown',
    detailLevel: 'detailed'
  });

  const generateDocs = async () => {
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const documentation = await generateDocumentation(code, config);
      setDocs(documentation);
    } catch (error) {
      console.error('Documentation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Documentation</h3>
        <button
          onClick={generateDocs}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="space-y-4 mb-4">
        <select
          value={config.format}
          onChange={(e) => setConfig({ ...config, format: e.target.value as any })}
          className="block w-full px-3 py-2 bg-gray-700 rounded"
        >
          <option value="markdown">Markdown</option>
          <option value="jsdoc">JSDoc</option>
          <option value="tsdoc">TSDoc</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.includeExamples}
            onChange={(e) => setConfig({ ...config, includeExamples: e.target.checked })}
            className="rounded"
          />
          <span>Include Examples</span>
        </label>

        <select
          value={config.detailLevel}
          onChange={(e) => setConfig({ ...config, detailLevel: e.target.value as any })}
          className="block w-full px-3 py-2 bg-gray-700 rounded"
        >
          <option value="brief">Brief</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      {docs && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Generated Documentation</h4>
          <pre className="p-4 bg-gray-900 rounded overflow-auto max-h-96">
            {docs}
          </pre>
        </div>
      )}
    </div>
  );
};