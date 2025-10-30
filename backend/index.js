import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ ok: true, message: "Server is alive and running"});
});

app.post('/api/echo', (req, res) => {
    res.json({ received: req.body });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});