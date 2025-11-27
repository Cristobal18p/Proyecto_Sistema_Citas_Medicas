import express from "express";
import {
  createCita,
  ObtenerCitaPorSeguimiento,
  obtenerCitas,
  cancelarCitaController,
  getCitas,
  updateCitaController,
  confirmarCitaController,
  getCitasMedicos,
  actualizarEstadoCitaController,
} from "../controllers/cita.controller.js";

const router = express.Router();

router.post("/", createCita);
router.get("/seguimiento/:numero", ObtenerCitaPorSeguimiento);
router.put("/:numero/cancelar", cancelarCitaController);
// Listado con filtros
router.get("/", obtenerCitas);
// Listado completo
router.get("/todas", getCitas);
// Actualizar una cita por id (relativo al prefijo /api/citas)
router.put("/:id", updateCitaController);
// Actualizar sólo el estado
router.put("/:id/estado", actualizarEstadoCitaController);
// Confirmar cita
router.put("/:id_cita/confirmar", confirmarCitaController);

router.get("/medico/:id_medico", getCitasMedicos);
export default router;
