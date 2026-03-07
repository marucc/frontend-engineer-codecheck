import { setGlobalOptions } from 'firebase-functions'
import { onRequest } from 'firebase-functions/https'

import apiApp from './api'

setGlobalOptions({
  maxInstances: 10,
  region: 'asia-northeast1',
})

export const api = onRequest({ secrets: ['API_KEY'] }, apiApp)
