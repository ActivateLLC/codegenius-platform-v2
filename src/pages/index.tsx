import React from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { MonacoEditor } from '../components/Editor/MonacoEditor';
import { Assistant } from '../components/AI/Assistant';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex h-full">
        <div className="flex-1">
          <MonacoEditor />
        </div>
        <div className="w-96">
          <Assistant />
        </div>
      </div>
    </MainLayout>
  );
}