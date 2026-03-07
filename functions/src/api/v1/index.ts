import express from 'express'

import notFound from '../notFound'
import population from './population'
import prefectures from './prefectures'

const api = express()

api.get('/prefectures', prefectures)
api.get('/population/:prefCode', population)
api.all('*', notFound)

export default api
