import { Server as SocketIOServer } from 'socket.io'
import type { Server as HttpServer } from 'http'
import type { Session, Participant, Buzz } from '../lib/types'

const sessions = new Map<string, Session>()

function generateSessionId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

function getUniqueSessionId(): string {
  let id: string
  do {
    id = generateSessionId()
  } while (sessions.has(id))
  return id
}

export function initSocketServer(httpServer: HttpServer) {
  // In split deployment, set CORS_ORIGIN to your Vercel URL:
  //   e.g.  CORS_ORIGIN=https://buzzer-self.vercel.app
  const corsOrigin = process.env.CORS_ORIGIN || '*'

  const io = new SocketIOServer(httpServer, {
    cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
  })

  io.on('connection', (socket) => {
    // Host creates a new session
    socket.on('create-session', () => {
      const sessionId = getUniqueSessionId()
      const session: Session = {
        sessionId,
        hostSocketId: socket.id,
        participants: [],
        currentRound: 1,
        roundStatus: 'waiting',
        buzzes: [],
      }
      sessions.set(sessionId, session)
      socket.join(sessionId)
      socket.emit('session-created', { sessionId })
      socket.emit('session-state', { session })
    })

    // Host rejoins existing session (after page refresh)
    socket.on('host-join', ({ sessionId }: { sessionId: string }) => {
      const session = sessions.get(sessionId)
      if (!session) {
        socket.emit('join-error', { message: 'Session not found. It may have expired.' })
        return
      }
      session.hostSocketId = socket.id
      socket.join(sessionId)
      socket.emit('session-state', { session })
    })

    // Participant joins a session
    socket.on('join-session', ({ sessionId, name }: { sessionId: string; name: string }) => {
      const session = sessions.get(sessionId)
      if (!session) {
        socket.emit('join-error', { message: 'Session not found. Check your session code.' })
        return
      }

      const trimmedName = name.trim() || 'Anonymous'

      // If a disconnected participant with same name exists, reconnect them
      const existing = session.participants.find(
        (p) => p.name === trimmedName && !p.connected
      )
      if (existing) {
        existing.socketId = socket.id
        existing.connected = true
      } else {
        const participant: Participant = {
          socketId: socket.id,
          name: trimmedName,
          joinedAt: new Date().toISOString(),
          connected: true,
        }
        session.participants.push(participant)
      }

      socket.join(sessionId)

      const hasBuzzed = session.buzzes.some((b) => b.participantSocketId === socket.id) ||
        (existing ? session.buzzes.some((b) => b.participantName === trimmedName) : false)

      socket.emit('joined-session', {
        sessionId,
        roundStatus: session.roundStatus,
        currentRound: session.currentRound,
        hasBuzzed,
      })

      // Notify everyone (host + participants) of updated list
      io.to(sessionId).emit('participant-list-update', {
        participants: session.participants,
      })
    })

    // Participant buzzes
    socket.on('buzz', ({ sessionId }: { sessionId: string }) => {
      const session = sessions.get(sessionId)
      if (!session || session.roundStatus !== 'open') return

      // Prevent duplicate buzz from same socket
      if (session.buzzes.some((b) => b.participantSocketId === socket.id)) return

      const participant = session.participants.find((p) => p.socketId === socket.id)
      if (!participant) return

      const buzz: Buzz = {
        participantName: participant.name,
        participantSocketId: socket.id,
        buzzedAt: new Date().toISOString(),
        order: session.buzzes.length + 1,
      }
      session.buzzes.push(buzz)

      socket.emit('buzzed-confirmed', { order: buzz.order })
      io.to(sessionId).emit('buzz-update', { buzzes: session.buzzes })
    })

    // Host: start round
    socket.on('start-round', ({ sessionId }: { sessionId: string }) => {
      const session = sessions.get(sessionId)
      if (!session || session.hostSocketId !== socket.id) return
      session.roundStatus = 'open'
      session.buzzes = []
      io.to(sessionId).emit('round-status-change', {
        roundStatus: 'open',
        currentRound: session.currentRound,
        buzzes: [],
      })
    })

    // Host: lock round
    socket.on('lock-round', ({ sessionId }: { sessionId: string }) => {
      const session = sessions.get(sessionId)
      if (!session || session.hostSocketId !== socket.id) return
      session.roundStatus = 'locked'
      io.to(sessionId).emit('round-status-change', {
        roundStatus: 'locked',
        currentRound: session.currentRound,
        buzzes: session.buzzes,
      })
    })

    // Host: reset round (clear buzzes, new round number, back to waiting)
    socket.on('reset-round', ({ sessionId }: { sessionId: string }) => {
      const session = sessions.get(sessionId)
      if (!session || session.hostSocketId !== socket.id) return
      session.roundStatus = 'waiting'
      session.buzzes = []
      session.currentRound += 1
      io.to(sessionId).emit('round-status-change', {
        roundStatus: 'waiting',
        currentRound: session.currentRound,
        buzzes: [],
      })
    })

    // Host: clear all participants
    socket.on('clear-participants', ({ sessionId }: { sessionId: string }) => {
      const session = sessions.get(sessionId)
      if (!session || session.hostSocketId !== socket.id) return
      session.participants = []
      session.buzzes = []
      session.roundStatus = 'waiting'
      io.to(sessionId).emit('participant-list-update', { participants: [] })
      io.to(sessionId).emit('round-status-change', {
        roundStatus: 'waiting',
        currentRound: session.currentRound,
        buzzes: [],
      })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      for (const [sessionId, session] of sessions.entries()) {
        const participant = session.participants.find((p) => p.socketId === socket.id)
        if (participant) {
          participant.connected = false
          io.to(sessionId).emit('participant-list-update', {
            participants: session.participants,
          })
        }
      }
    })
  })

  return io
}
