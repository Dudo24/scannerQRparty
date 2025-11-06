const apiBase = "http://localhost:4000/api"

document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken")
  if (!authToken) {
    window.location.href = "login.html"
    return
  }

  async function fetchGuestStatus() {
    try {
      const res = await fetch(`${apiBase}/guestStatus`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const data = await res.json()
      const guestTableBody = document.getElementById("guestTableBody")
      guestTableBody.innerHTML = ""
      data.forEach((guest) => {
        const row = guestTableBody.insertRow()
        row.insertCell().setAttribute("data-label", "Nombre")
        row.cells[0].textContent = guest.nombre
        row.insertCell().setAttribute("data-label", "Hora Entrada")
        row.cells[1].textContent = guest.hora_ingreso
        row.insertCell().setAttribute("data-label", "Estado")
        row.cells[2].textContent = guest.estado
      })
    } catch (error) {
      console.error("Error al obtener el estado de los invitados:", error)
      showNotification("Error", "No se pudo cargar el estado de los invitados", "error")
    }
  }

  function showNotification(title, message, type = "info") {
    // Remove existing notification if present
    const existingNotif = document.getElementById("notification-container")
    if (existingNotif) {
      existingNotif.remove()
    }

    const container = document.createElement("div")
    container.id = "notification-container"
    container.className = `notification notification-${type}`

    const icon = getNotificationIcon(type)

    container.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icon}</span>
        <div class="notification-text">
          <strong class="notification-title">${title}</strong>
          <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `

    document.body.appendChild(container)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (container.parentElement) {
        container.remove()
      }
    }, 5000)
  }

  function getNotificationIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    }
    return icons[type] || icons.info
  }

  fetchGuestStatus()
  setInterval(fetchGuestStatus, 5000) // Actualizar cada 5 segundos

  window.showNotification = showNotification
})
