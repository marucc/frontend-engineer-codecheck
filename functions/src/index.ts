import { setGlobalOptions } from 'firebase-functions'
import { onRequest } from 'firebase-functions/https'

setGlobalOptions({
  maxInstances: 10,
  region: 'asia-northeast1',
})

export const api = onRequest({}, async (req, res) => {
  res.json({})
})
