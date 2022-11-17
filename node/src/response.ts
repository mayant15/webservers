export default class Response {
  private _body: string
  private _code: number
  private _reasonPhrase: string

  constructor({body, code, reasonPhrase}: {
    body: string
    code: number
    reasonPhrase?: string
  }) {
    this._body = body
    this._code = code
    this._reasonPhrase = reasonPhrase ?? this._getReasonPhrase(code)
  }

  bytes(): Buffer {
    const statusline = `HTTP/1.1 ${this._code} ${this._reasonPhrase}`
    const response = `${statusline}\r\nContent-Length: ${this._body.length}\r\n\r\n${this._body}`
    return Buffer.from(response, 'ascii')
  }
  
  private _getReasonPhrase(code: number) {
    switch(code) {
      case 404: return "NOT FOUND"
      case 200: return "OK"
      default: return "UNKNOWN"
    }
  }
}

