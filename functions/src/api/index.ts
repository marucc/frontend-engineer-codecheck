import express from 'express'

import notFound from './notFound'
import v1 from './v1'

const api = express()

api.use('/v1', v1)
api.all('*', notFound)

export default api
