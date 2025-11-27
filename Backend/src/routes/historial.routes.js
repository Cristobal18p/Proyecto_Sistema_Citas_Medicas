import express from "express";
import {
  getHistoriales,
  getHistorial,
  createHistorial,
  updateHistorial,
  deleteHistorial,
} from "../controllers/historial.controller.js";

const router = express.Router();

// Registrar consulta médica (crear historial)
router.post("/", createHistorial);

// Listado y gestión de historiales
router.get("/", getHistoriales);
router.get("/:id", getHistorial);
router.put("/:id", updateHistorial);
router.delete("/:id", deleteHistorial);

export default router;
