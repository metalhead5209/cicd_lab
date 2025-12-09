import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Server is alive and running' })
})

app.post('/api/echo', (req, res) => {
  res.json({ received: req.body })
})

export default app
