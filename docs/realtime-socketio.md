Realtime Socket.IO Integration Guide
====================================

This guide explains how to connect a frontend application to the realtime Gateway provided by this API. The examples use TypeScript.

## Server URL

The Socket.IO server is exposed from the same origin as the REST API. Connections use the path `/ws` and must send a valid access token obtained from the `/auth/login` or `/auth/refresh` endpoints.

```ts
const socket = io('http://localhost:3000', {
  path: '/ws',
  auth: { token: ACCESS_TOKEN },
});
```

On connection the backend places the client in rooms based on the authenticated user ID and role. Events are emitted only to the relevant rooms.

### Events

| Event name   | Payload                     | Description                                     |
|--------------|-----------------------------|-------------------------------------------------|
| `express:new`| `{ orderId: string }`       | A new express order available for contractors   |
| `ticket:new` | `{ userId: string }`        | A customer service ticket for admins            |

Additional events may be added in future updates.

---

## React Native (Expo)

1. Install the Socket.IO client for React Native.

```sh
bun add socket.io-client
```

2. Create a module to handle the connection.

```ts
// lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connect = (token: string) => {
  socket = io('https://your-api-url.com', {
    path: '/ws',
    auth: { token },
  });
  return socket;
};

export const getSocket = () => socket;
```

3. Use the connection in your components.

```ts
import React, { useEffect } from 'react';
import { connect } from '../lib/socket';

export default function App() {
  useEffect(() => {
    const s = connect(ACCESS_TOKEN);
    s.on('express:new', ({ orderId }) => {
      console.log('New express order', orderId);
    });
  }, []);

  return null;
}
```

---

## Next.js (App Router)

1. Add the Socket.IO client.

```sh
bun add socket.io-client
```

2. Create a React hook for the connection.

```ts
// lib/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(token: string) {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io('https://your-api-url.com', {
      path: '/ws',
      auth: { token },
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  return socketRef;
}
```

3. Listen for events inside components.

```tsx
import { useSocket } from '../lib/useSocket';

export default function Page() {
  const socketRef = useSocket(ACCESS_TOKEN);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('ticket:new', ({ userId }) => {
      console.log('New support ticket from', userId);
    });

    return () => {
      socket.off('ticket:new');
    };
  }, [socketRef]);

  return <div />;
}
```

This setup will keep your front‑end in sync with realtime updates from the API for contractors, consumers and admins.
