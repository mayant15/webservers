import type Socket from './socket'

enum HttpMethod {
  GET = "GET",
  UNKNOWN = "UNKNOWN"
}

function httpMethodFromString(v: string): HttpMethod {
  switch (v) {
    case 'GET': return HttpMethod.GET
    default: return HttpMethod.UNKNOWN
  }
}

export default class Request {
  private _route: string
  private _method: HttpMethod

  static async from(socket: Socket) {
    const bufferData = await socket.read()
    return new Request(bufferData)
  }

  private constructor(data: string) {
    const lines = data.split('\n')
    // const _headers = lines.slice(1) // TODO: Avoid making this copy
    const [method, route] = lines[0].split(' ')
    this._route = route
    this._method = httpMethodFromString(method)
  }

  get route() {
    return this._route
  }

  get method() {
    return this._method
  }

  toString() {
    return `Request <${this._method} ${this._route}>`
  }
}
