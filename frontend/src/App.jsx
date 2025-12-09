import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(47)
  const [health, setHealth] = useState({
    status: 'loading',
    message: 'Checking backend health...'
  })

  useEffect(() => {
    let isMounted = true

    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')

        if (!response.ok) {
          throw new Error(`Backend responded with ${response.status}`)
        }

        const body = await response.json()

        if (isMounted) {
          setHealth({
            status: body.ok ? 'healthy' : 'unhealthy',
            message: body.message ?? 'Backend responded successfully'
          })
        }
      } catch (error) {
        if (isMounted) {
          setHealth({
            status: 'unreachable',
            message: error.message
          })
        }
      }
    }

    checkHealth()

    return () => {
      isMounted = false
    }
  }, [])

  const statusClass = useMemo(() => {
    if (health.status === 'healthy') return 'status-pill success'
    if (health.status === 'loading') return 'status-pill muted'
    return 'status-pill warning'
  }, [health.status])

  return (
    <main className="page">
      <header>
        <h1>CICD Pipeline</h1>
        <p className="subtitle">React + Express demo application</p>
      </header>

      <section className="panel">
        <div className="panel-row">
          <div>
            <p className="label">Pipeline test number</p>
            <p className="value">#{count}</p>
            <p className="byline">By: Aaron Rodi</p>
          </div>
          <button onClick={() => setCount((value) => value + 1)}>
            Increment counter
          </button>
        </div>
      </section>

      <section className="panel">
        <p className="label">Backend status</p>
        <div className={statusClass}>{health.status}</div>
        <p className="status-message">{health.message}</p>
      </section>
    </main>
  )
}

export default App
