import express from 'express';
import { getEspecialidades } from "../controllers/especialidad.controller.js";

const router = express.Router();
router.get("/", getEspecialidades);

export default router;