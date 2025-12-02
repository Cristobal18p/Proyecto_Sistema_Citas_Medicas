import express from "express";
import {
  getMedicos,
  getDisponibilidadPorMedico,
  createMedico,
  updateMedico,
  getMedicosDetalle,
} from "../controllers/medico.controller.js";

const router = express.Router();

router.get("/", getMedicos);
router.get("/detalle", getMedicosDetalle);
router.get("/:id/disponibilidad", getDisponibilidadPorMedico);
router.post("/", createMedico);
router.put("/:id", updateMedico);

export default router;
