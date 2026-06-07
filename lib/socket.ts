import { io, type Socket } from 'socket.io-client'

let socketInstance: Socket | null = null

export function getSocket(): Socket {
  if (typeof window === 'undefined') {
    throw new Error('getSocket() must be called on the client side')
  }
  if (!socketInstance) {
    socketInstance = io()
  }
  return socketInstance
}
