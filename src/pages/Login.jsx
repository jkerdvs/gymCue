import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  function handleLogin() {
    // TODO: Replace with real auth later (Firebase or backend)
    navigate("/dashboard")
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>gymCue</h1>
      <p>Login to your account</p>
      <input type="text" placeholder="Email" />
      <br />
      <input type="password" placeholder="Password" />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
