import type { Request, Response } from 'express'

import notFound from './notFound'

vi.mock('firebase-functions/params', () => ({
  defineSecret: () => ({ value: () => 'test-api-key' }),
}))

vi.mock('../env', () => ({
  API_BASE_URL: 'https://api.example.com',
}))

const mockResponse = () => {
  const res = {} as Response
  res.status = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('notFound', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('404 を返す', async () => {
    const req = {} as Request
    const res = mockResponse()

    await notFound(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})
