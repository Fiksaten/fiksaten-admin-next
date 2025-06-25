import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connect = (token: string): Socket => {
  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
    path: '/ws',
    auth: { token },
  });
  return socket;
};

export const getSocket = () => socket;
