import type { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  res.status(404).send({ error: { message: 'Not Found', status: 404 } })
}
