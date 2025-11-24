import { useEffect, useState } from 'react'
import './App.css'



function App() {
  const [count, setCount] = useState(42)
  const [health, setHealth] = useState({})

useEffect(() => {
    setHealth({ ok: true})
  },[])


  return (
    <>
      <h1>CICD Pipeline</h1>
      <h2>Pipeline test #{count} </h2>
      <h2>By: Aaron Rodi</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
