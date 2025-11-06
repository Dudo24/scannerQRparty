import { toggleDarkMode } from './darkMode.js';
const apiBase = "http://localhost:4000/api";

// Protección de ruta
document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    window.location.href = 'login.html';
    return;
  }

  // Lógica de registro de invitados
  window.registrarInvitado = async function() {
    const nombre = document.getElementById("nombre").value;
    if (!nombre) return alert("Ingrese un nombre");

    const res = await fetch(`${apiBase}/invitados`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
      body: JSON.stringify({ nombre })
    });
    const data = await res.json();
    const qrContainer = document.getElementById("qrContainer");
    qrContainer.innerHTML = `<p>${data.nombre}</p><img src="${data.qrImage}" alt="QR">`;
  };

  // Lógica de escaneo de QR
  const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  scanner.render(async (decodedText) => {
    try {
      const code = decodedText.split("/").pop();
      const res = await fetch(`${apiBase}/validar/${code}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await res.json();
      alert(`${data.msg}\n🕒 ${data.hora || ""}`);
    } catch (error) {
      console.error('Error al escanear QR:', error);
      alert("QR inválido o error de conexión.");
    }
  });
});