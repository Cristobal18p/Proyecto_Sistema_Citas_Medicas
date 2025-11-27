import express from "express";
import {
  crearPaciente,
  validarPaciente,getPaciente, getPacientes
} from "../controllers/paciente.controller.js";

const router = express.Router();



router.post("/", crearPaciente);
router.post("/validar", validarPaciente);
router.get("/:cedula", getPaciente);
router.get("/", getPacientes);

export default router;
