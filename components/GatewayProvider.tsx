'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';
import { connect } from '@/lib/socket';

interface GatewayContextValue {
  socket: Socket | null;
}

const GatewayContext = createContext<GatewayContextValue>({ socket: null });

export function GatewayProvider({ children }: { children: React.ReactNode }) {
  const { tokens } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!tokens?.accessToken) return;

    const s = connect(tokens.accessToken);
    socketRef.current = s;

    const handleExpress = ({ orderId }: { orderId: string }) => {
      console.log('New express order', orderId);
    };

    const handleTicket = ({ userId }: { userId: string }) => {
      console.log('New support ticket from', userId);
    };

    s.on('express:new', handleExpress);
    s.on('ticket:new', handleTicket);

    return () => {
      s.off('express:new', handleExpress);
      s.off('ticket:new', handleTicket);
      s.disconnect();
      socketRef.current = null;
    };
  }, [tokens?.accessToken]);

  return (
    <GatewayContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </GatewayContext.Provider>
  );
}

export function useGateway() {
  return useContext(GatewayContext);
}
