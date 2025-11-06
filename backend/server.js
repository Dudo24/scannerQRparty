console.log("server.js: Inicio de ejecución");
import express from "express";
import cors from "cors";
import QRCode from "qrcode";
import { db } from "./db.js";
console.log("server.js: db.js importado");
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
console.log("server.js: dotenv configurado");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));
console.log("server.js: Middleware configurado");

// ===== LOGIN SIMPLE =====
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    return res.json({ success: true, token: "organizador123" });
  }
  res.status(401).json({ success: false, msg: "Credenciales incorrectas" });
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null || token !== "organizador123") return res.sendStatus(403); // Token inválido o no proporcionado
  next();
}

// ===== REGISTRAR INVITADO =====
app.post("/api/invitados", authenticateToken, async (req, res) => {
  const { nombre } = req.body;
  const qr_code = crypto.randomUUID();
  await db.run("INSERT INTO invitados (nombre, qr_code, estado) VALUES (?, ?, ?)", [nombre, qr_code, 'pendiente']);
  const qrImage = await QRCode.toDataURL(`https://tufiesta.vercel.app/validar/${qr_code}`);
  res.json({ nombre, qr_code, qrImage });
});

// ===== VALIDAR QR =====
app.get("/api/validar/:codigo", authenticateToken, async (req, res) => {
  const { codigo } = req.params;
  const invitado = await db.get("SELECT * FROM invitados WHERE qr_code = ?", [codigo]);
  if (!invitado) return res.status(404).json({ msg: "❌ QR no válido" });
  if (invitado.estado === 'ingresado') return res.json({ msg: "⚠️ QR ya usado" });

  const hora = new Date().toLocaleString("es-PE", { timeZone: "America/Lima" });
  await db.run("UPDATE invitados SET estado = ?, hora_ingreso = ? WHERE id = ?", ['ingresado', hora, invitado.id]);
  res.json({ msg: `✅ Bienvenido ${invitado.nombre}`, hora });
});

// ===== OBTENER ESTADO DE INVITADOS =====
app.get("/api/guestStatus", authenticateToken, async (req, res) => {
  const invitados = await db.all("SELECT nombre, hora_ingreso, estado FROM invitados");
  res.json(invitados);
});
console.log("server.js: Rutas configuradas");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/login.html"));
});

try {
  console.log("server.js: Intentando iniciar el servidor");
  app.listen(process.env.PORT, () => console.log(`✅ Backend en puerto ${process.env.PORT}`));
} catch (error) {
  console.error("Error al iniciar el servidor:", error);
}
console.log("server.js: Fin de ejecución");
