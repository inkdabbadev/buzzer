/**
 * Standalone Socket.IO server — no Next.js.
 * Deploy this on Railway / Render / any VPS.
 * The Next.js frontend (Vercel) connects to it via NEXT_PUBLIC_SOCKET_URL.
 *
 * Railway usage:
 *   Build command : npm install
 *   Start command : npm run start:socket
 */
import { createServer } from 'http'
import { initSocketServer } from './server/socketServer'

const port = parseInt(process.env.PORT || '3001', 10)

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', ts: Date.now() }))
    return
  }
  res.writeHead(404)
  res.end()
})

initSocketServer(httpServer)

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`> Socket.IO server ready on port ${port}`)
})
