# Proyecto QR Party Access

Este proyecto es un sistema de control de acceso para eventos utilizando códigos QR. Permite registrar invitados, generar códigos QR únicos y validar la entrada de los asistentes.

## Estructura del Proyecto

- **backend/**: Contiene la lógica del servidor (Node.js con Express), la base de datos (SQLite) y la API.
- **frontend/**: Contiene la interfaz de usuario (HTML, CSS, JavaScript) para el registro de invitados, el login y la visualización del estado de los invitados.

## Cómo Empezar

1.  Clona este repositorio.
2.  Instala las dependencias del backend:
    ```bash
    cd backend
    npm install
    ```
3.  Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:
    ```
    ADMIN_USER=tu_usuario
    ADMIN_PASS=tu_contraseña
    PORT=4000
    ```
4.  Inicia el servidor backend:
    ```bash
    npm start
    ```
5.  Abre `frontend/html/login.html` en tu navegador para acceder a la aplicación.