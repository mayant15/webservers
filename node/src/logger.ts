import {DEBUG} from './config'

const Log = {
  info: (...args: any[]) => console.log('[info ]', ...args),
  debug: (...args: any[]) => DEBUG ? console.log('[debug]', ...args) : void 0,
  warn: (...args: any[]) => console.warn('[warn ]', ...args),
  error: (...args: any[]) => console.error('[error]', ...args),
}

export default Log

