import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS invitados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    qr_code TEXT,
    estado TEXT DEFAULT 'pendiente',
    hora_ingreso TEXT
  );
`);
