import {Server as NodeServer} from 'net'
import Socket from './socket'
import Logger from './logger'

// A promise-based API for net
export class Server {
  private _server: NodeServer

  constructor(connectionListener: (_: Socket) => void) {
    this._server = new NodeServer({}, (nodeSocket) => {
      const socket = new Socket(nodeSocket)
      connectionListener(socket)
    })
  }

  async listen(port: number, host?: string) {
    return new Promise((res, rej) => {
      this._server.on('close', () => {
        res(null)
      })
      this._server.on('error', (e) => {
        rej(e)
      })
      
      this._server.listen(port, host, () => {
        Logger.info(`Listening on ${host}:${port}`)
      })
    })
  }
}

