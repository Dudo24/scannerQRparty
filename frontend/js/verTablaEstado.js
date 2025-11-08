import { toggleDarkMode } from './darkMode.js';
const apiBase = "http://localhost:4000/api";

let allGuests = [];

document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    window.location.href = 'login.html';
    return;
  }

  async function fetchGuestStatus() {
    try {
      const res = await fetch(`${apiBase}/guestStatus`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await res.json();
      allGuests = data;
      renderTable(data);
    } catch (error) {
      console.error('Error al obtener el estado de los invitados:', error);
      alert('Error al cargar el estado de los invitados.');
    }
  }

  function renderTable(guests) {
    const guestTableBody = document.getElementById('guestTableBody');
    guestTableBody.innerHTML = '';
    guests.forEach(guest => {
      const row = guestTableBody.insertRow();
      row.insertCell().textContent = guest.nombre;
      row.insertCell().textContent = guest.hora_ingreso;
      row.insertCell().textContent = guest.estado;
    });
  }

  document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allGuests.filter(guest => 
      guest.nombre.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
  });

  fetchGuestStatus();
  setInterval(fetchGuestStatus, 5000);
});
