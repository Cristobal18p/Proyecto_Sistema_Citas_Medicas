import * as MedicoModel from '../models/medico.model.js';

export const getMedicos = async (req, res) => {
  try {
    const medicos = await MedicoModel.findAllMedicos();
    res.json(medicos);
  } catch (err) {
    console.error("Error al obtener médicos", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getDisponibilidadPorMedico = async (req, res) => {
  const { id } = req.params;

  try {
    const disponibilidad = await MedicoModel.getDisponibilidadPorMedico(id);
    res.json(disponibilidad);
  } catch (err) {
    console.error("Error al obtener disponibilidad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

