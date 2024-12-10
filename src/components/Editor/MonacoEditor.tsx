import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../stores/editorStore';

export const MonacoEditor = () => {
  const { code, setCode } = useEditorStore();

  return (
    <div className="h-full w-full bg-gray-900">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          formatOnPaste: true,
          formatOnType: true
        }}
      />
    </div>
  );
};