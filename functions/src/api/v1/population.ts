import type { Request, Response } from 'express'
import { defineSecret } from 'firebase-functions/params'

import { API_BASE_URL } from '../../env'

const apiKeySecret = defineSecret('API_KEY')

export default async (req: Request, res: Response) => {
  const { prefCode } = req.params
  if (!prefCode) {
    res.status(404).send({ error: { message: 'Not Found', status: 404 } })
    return
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      { headers: { 'X-API-KEY': apiKeySecret.value() } }
    )
    if (!response.ok) {
      const { status, statusText } = response
      console.error('Error response from API:', status, statusText)
      res.status(status).send({ error: { message: statusText, status } })
      return
    }
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching data from API:', error)
    res.status(502).send({ error: { message: 'Bad Gateway', status: 502 } })
  }
}
