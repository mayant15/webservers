import {Server} from './server'
import Response from './response'
import Request from './request'
import type Socket from './socket'
import Logger from './logger'

type RequestHandler = (req: Request) => Promise<Response>
type Router = Record<string, RequestHandler>
const router: Router = {}

async function handleConnection(conn: Socket) {
  const req = await Request.from(conn)
  Logger.debug(req.toString())

  const route = req.route
  if (route in router) {
    const response = await router[route](req)
    await conn.closeWithMessage(response.bytes())
  } else {
    const response = new Response({
      code: 404,
      body: 'The requested resource could not be found'
    })
    await conn.closeWithMessage(response.bytes())
  }
}

async function main() {
  const server = new Server(handleConnection)

  router['/'] = async (_) => new Response({
    body: 'OKAY!',
    code: 200,
  })

  await server.listen(7878, '127.0.0.1')
}

main()
  .catch(e => {
    Logger.error(e)
    process.exit(1)
  })
  .then(x => {
    Logger.info('Done!')
  })
