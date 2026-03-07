import type { Request, Response } from 'express'

import population from './population'

vi.mock('firebase-functions/params', () => ({
  defineSecret: () => ({ value: () => 'test-api-key' }),
}))

vi.mock('../../env', () => ({
  API_BASE_URL: 'https://api.example.com',
}))

const mockResponse = () => {
  const res = {} as Response
  res.status = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('population-composition', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('正常', async () => {
    const mockData = { result: { prefCode: 1 } }
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as globalThis.Response)

    const req = { params: { prefCode: '1' } } as unknown as Request
    const res = mockResponse()

    await population(req, res)

    expect(res.json).toHaveBeenCalledWith(mockData)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/population/composition/perYear?prefCode=1',
      { headers: { 'X-API-KEY': 'test-api-key' } }
    )
  })

  it('異常：prefCode がない場合 404 を返す', async () => {
    const req = { params: {} } as Request
    const res = mockResponse()

    await population(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('異常：API がエラーを返した場合、そのステータスを返す', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    } as globalThis.Response)

    const req = { params: { prefCode: '1' } } as unknown as Request
    const res = mockResponse()

    await population(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('異常：fetch が例外を投げた場合 502 を返す', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))

    const req = { params: { prefCode: '1' } } as unknown as Request
    const res = mockResponse()

    await population(req, res)

    expect(res.status).toHaveBeenCalledWith(502)
  })
})
