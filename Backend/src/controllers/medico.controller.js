import * as MedicoModel from "../models/medico.model.js";

export const getMedicos = async (req, res) => {
  try {
    const medicos = await MedicoModel.findAllMedicos();
    res.json(medicos);
  } catch (err) {
    console.error("Error al obtener médicos", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getMedicosDetalle = async (req, res) => {
  try {
    const medicos = await MedicoModel.findAllMedicosDetalle();
    res.json(medicos);
  } catch (err) {
    console.error("Error al obtener detalle de médicos", err);
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

export const createMedico = async (req, res) => {
  try {
    const nuevo = await MedicoModel.createMedico(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error al crear médico", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateMedico = async (req, res) => {
  const { id } = req.params;

  try {
    const actualizado = await MedicoModel.updateMedico(id, req.body);
    if (!actualizado) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }
    res.json(actualizado);
  } catch (err) {
    console.error("Error al actualizar médico", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
