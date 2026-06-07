export type RoundStatus = 'waiting' | 'open' | 'locked'

export interface Participant {
  socketId: string
  name: string
  joinedAt: string
  connected: boolean
}

export interface Buzz {
  participantName: string
  participantSocketId: string
  buzzedAt: string
  order: number
}

export interface Session {
  sessionId: string
  hostSocketId: string
  participants: Participant[]
  currentRound: number
  roundStatus: RoundStatus
  buzzes: Buzz[]
}

// Lightweight state sent to participants
export interface PublicSessionState {
  sessionId: string
  roundStatus: RoundStatus
  currentRound: number
}

// Socket event payloads (server → client)
export interface SessionCreatedPayload {
  sessionId: string
}

export interface SessionStatePayload {
  session: Session
}

export interface JoinedSessionPayload {
  sessionId: string
  roundStatus: RoundStatus
  currentRound: number
  hasBuzzed: boolean
}

export interface JoinErrorPayload {
  message: string
}

export interface ParticipantListUpdatePayload {
  participants: Participant[]
}

export interface RoundStatusChangePayload {
  roundStatus: RoundStatus
  currentRound: number
  buzzes: Buzz[]
}

export interface BuzzUpdatePayload {
  buzzes: Buzz[]
}

export interface BuzzedConfirmedPayload {
  order: number
}
