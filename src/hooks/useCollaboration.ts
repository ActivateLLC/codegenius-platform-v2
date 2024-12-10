import { useEffect, useRef } from 'react';
import { CollaborationClient } from '../websocket/client';
import { useEditorStore } from '../stores/editorStore';

export function useCollaboration(roomId: string, userId: string, userName: string) {
  const client = useRef<CollaborationClient | null>(null);
  const { code, setCode } = useEditorStore();

  useEffect(() => {
    client.current = new CollaborationClient();

    client.current.on('code', (newCode: string) => {
      setCode(newCode);
    });

    client.current.joinRoom(roomId, { id: userId, name: userName });

    return () => {
      client.current?.disconnect();
    };
  }, [roomId, userId, userName]);

  useEffect(() => {
    if (client.current) {
      client.current.updateCode(roomId, code);
    }
  }, [code, roomId]);

  return {
    updateCursor: (cursor: { line: number; column: number }) => {
      client.current?.updateCursor(roomId, cursor);
    }
  };
}