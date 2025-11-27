import express from 'express';
import {
  getMedicos, getDisponibilidadPorMedico
} from '../controllers/medico.controller.js';

const router = express.Router();


router.get('/', getMedicos); 
router.get("/:id/disponibilidad", getDisponibilidadPorMedico);


export default router;
    