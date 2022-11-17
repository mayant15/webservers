import type {Socket as NodeSocket} from 'net'

export default class Socket {
  private _socket: NodeSocket

  constructor(nodeSocket: NodeSocket) {
    this._socket = nodeSocket
  }

  async closeWithMessage(message: string | Buffer): Promise<void> {
    return new Promise((res, rej) => {
      this._socket.end(message, (e?: unknown) => {
        e ? rej(e) : res(void 0)
      })
    })
  }

  // TODO: Look up how to read from socket properly
  async read(): Promise<string> {
    return new Promise((res, rej) => {
      this._socket.on('data', (data?: Buffer | string) => {
        if (data) {
          if (typeof data === 'string') {
            res(data)
          } else {
            // NOTE: I assume the buffer is ASCII encoded
            res(data.toString('ascii'))
          }
        }
      })
    })
  }
}
