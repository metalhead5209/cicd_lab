import http from 'http'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import app from './app.js'

let server
let baseUrl

beforeAll(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      baseUrl = `http://127.0.0.1:${address.port}`
      resolve()
    })
  })
})

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolve()
    })
  })
})

describe('API endpoints', () => {
  it('returns health status', async () => {
    const response = await fetch(`${baseUrl}/api/health`)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      ok: true,
      message: 'Server is alive and running'
    })
  })

  it('echoes posted payloads', async () => {
    const payload = { message: 'hello world' }
    const response = await fetch(`${baseUrl}/api/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ received: payload })
  })
})
