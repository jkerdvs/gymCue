import { useState } from "react"

export default function Equipment() {
  const [queue, setQueue] = useState([])

  function joinQueue() {
    const newUser = `User ${queue.length + 1}`
    setQueue([...queue, newUser])
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Equipment Page</h1>
      <button onClick={joinQueue}>Join Queue</button>
      <ul>
        {queue.map((user, i) => (
          <li key={i}>{user}</li>
        ))}
      </ul>
    </div>
  )
}
