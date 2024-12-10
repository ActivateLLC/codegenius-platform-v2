import { Server } from 'socket.io';
import http from 'http';
import { parse } from 'url';

interface User {
  id: string;
  name: string;
  cursor?: {
    line: number;
    column: number;
  };
}

interface Room {
  id: string;
  users: Map<string, User>;
  code: string;
}

class CollaborationServer {
  private io: Server;
  private rooms: Map<string, Room> = new Map();

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-room', ({ roomId, user }) => {
        this.handleJoinRoom(socket, roomId, user);
      });

      socket.on('code-change', ({ roomId, code }) => {
        this.handleCodeChange(socket, roomId, code);
      });

      socket.on('cursor-move', ({ roomId, cursor }) => {
        this.handleCursorMove(socket, roomId, cursor);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleJoinRoom(socket: any, roomId: string, user: User) {
    let room = this.rooms.get(roomId);
    
    if (!room) {
      room = {
        id: roomId,
        users: new Map(),
        code: ''
      };
      this.rooms.set(roomId, room);
    }

    room.users.set(socket.id, user);
    socket.join(roomId);

    // Send current state to new user
    socket.emit('room-state', {
      code: room.code,
      users: Array.from(room.users.values())
    });

    // Notify others of new user
    socket.to(roomId).emit('user-joined', user);
  }

  private handleCodeChange(socket: any, roomId: string, code: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.code = code;
    socket.to(roomId).emit('code-update', code);
  }

  private handleCursorMove(socket: any, roomId: string, cursor: { line: number; column: number }) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const user = room.users.get(socket.id);
    if (!user) return;

    user.cursor = cursor;
    socket.to(roomId).emit('cursor-update', { userId: socket.id, cursor });
  }

  private handleDisconnect(socket: any) {
    for (const [roomId, room] of this.rooms) {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        this.io.to(roomId).emit('user-left', socket.id);

        if (room.users.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    }
  }
}

export function createWebSocketServer(server: http.Server) {
  return new CollaborationServer(server);
}