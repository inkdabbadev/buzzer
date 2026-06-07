import { io, type Socket } from 'socket.io-client'

let socketInstance: Socket | null = null

export function getSocket(): Socket {
  if (typeof window === 'undefined') {
    throw new Error('getSocket() must be called on the client side')
  }
  if (!socketInstance) {
    // In local dev (custom server) no URL is needed — connects to same origin.
    // In split deployment (Vercel frontend + separate backend), set:
    //   NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? ''
    socketInstance = io(url, {
      transports: ['websocket', 'polling'],
    })
  }
  return socketInstance
}
