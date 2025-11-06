const apiBase = "http://localhost:4000/api"

document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const errorDiv = document.getElementById("loginError")

  errorDiv.textContent = ""

  try {
    const response = await fetch(`${apiBase}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem("authToken", data.token)
      window.location.href = "index.html"
    } else {
      errorDiv.textContent = data.msg || "Error en la autenticación"
    }
  } catch (error) {
    errorDiv.textContent = "Error de conexión con el servidor"
    console.error("Login error:", error)
  }
})
