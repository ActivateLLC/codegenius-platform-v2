import { io, Socket } from 'socket.io-client';

export class CollaborationClient {
  private socket: Socket | null = null;
  private handlers: Map<string, Function[]> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
      autoConnect: false
    });

    this.socket.on('connect', () => {
      console.log('Connected to collaboration server');
      this.emit('event', 'connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
      this.emit('event', 'disconnected');
    });

    this.socket.on('code-update', (code: string) => {
      this.emit('code', code);
    });

    this.socket.on('cursor-update', (data: { userId: string; cursor: any }) => {
      this.emit('cursor', data);
    });

    this.socket.on('user-joined', (user: any) => {
      this.emit('user', { type: 'joined', user });
    });

    this.socket.on('user-left', (userId: string) => {
      this.emit('user', { type: 'left', userId });
    });
  }

  public joinRoom(roomId: string, user: { id: string; name: string }) {
    if (!this.socket) return;
    
    this.socket.connect();
    this.socket.emit('join-room', { roomId, user });
  }

  public updateCode(roomId: string, code: string) {
    if (!this.socket) return;
    this.socket.emit('code-change', { roomId, code });
  }

  public updateCursor(roomId: string, cursor: { line: number; column: number }) {
    if (!this.socket) return;
    this.socket.emit('cursor-move', { roomId, cursor });
  }

  public on(event: string, handler: Function) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)?.push(handler);
  }

  private emit(event: string, data: any) {
    this.handlers.get(event)?.forEach(handler => handler(data));
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}