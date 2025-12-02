import * as DisponibilidadModel from "../models/disponibilidad.model.js";

export const getDisponibilidad = async (req, res) => {
  try {
    const disponibilidad = await DisponibilidadModel.findAllDisponibilidad();
    res.json(disponibilidad);
  } catch (err) {
    console.error("Error al obtener disponibilidad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getDisponibilidadById = async (req, res) => {
  const { id } = req.params;

  try {
    const disponibilidad = await DisponibilidadModel.findDisponibilidadById(id);
    if (!disponibilidad) {
      return res.status(404).json({ message: "Disponibilidad no encontrada" });
    }
    res.json(disponibilidad);
  } catch (err) {
    console.error("Error al obtener disponibilidad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getDisponibilidadByMedico = async (req, res) => {
  const { id_medico } = req.params;

  try {
    const disponibilidad = await DisponibilidadModel.findDisponibilidadByMedico(
      id_medico
    );
    res.json(disponibilidad);
  } catch (err) {
    console.error("Error al obtener disponibilidad del médico:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createDisponibilidad = async (req, res) => {
  try {
    const nueva = await DisponibilidadModel.createDisponibilidad(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    console.error("Error al crear disponibilidad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateDisponibilidad = async (req, res) => {
  const { id } = req.params;

  try {
    const actualizada = await DisponibilidadModel.updateDisponibilidad(
      id,
      req.body
    );
    if (!actualizada) {
      return res.status(404).json({ message: "Disponibilidad no encontrada" });
    }
    res.json(actualizada);
  } catch (err) {
    console.error("Error al actualizar disponibilidad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteDisponibilidad = async (req, res) => {
  const { id } = req.params;

  try {
    const eliminada = await DisponibilidadModel.deleteDisponibilidad(id);
    if (!eliminada) {
      return res.status(404).json({ message: "Disponibilidad no encontrada" });
    }
    res.json({ message: "Disponibilidad eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar disponibilidad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
