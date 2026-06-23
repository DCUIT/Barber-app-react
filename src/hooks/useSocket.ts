import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { API_URL } from '../utils/constants';

let globalSocket: Socket | null = null;

export function getSocket(): Socket | null {
  return globalSocket;
}

export function useSocket() {
  const ref = useRef<Socket | null>(globalSocket);

  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io(API_URL, { transports: ['websocket'] });
      ref.current = globalSocket;
    }
  }, []);

  return ref.current || globalSocket;
}
