import type { Express } from 'express'
import type { IncomingMessage } from 'http'
import type WebSocket from 'ws'

export const initWebSocket = (
  wss: WebSocket.Server<typeof WebSocket.WebSocket, typeof IncomingMessage>,
  app: Express,
) => {
  app.use((req, _, next) => {
    req.context = {
      ...req.context,
      wss: wss,
    }

    next()
  })
}
