
import * as PacienteModel from "../models/paciente.model.js";

export const crearPaciente = async (req, res) => {
  try {
    const nuevo = await PacienteModel.crearPaciente(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al registrar paciente" });
  }
};

export const validarPaciente = async (req, res) => {
  const { cedula, fecha_nacimiento } = req.body;

  try {
    const paciente = await PacienteModel.validarPaciente(
      cedula,
      fecha_nacimiento
    );

    if (paciente) {
      res.json({ existe: true, paciente });
    } else {
      res.json({ existe: false });
    }
  } catch (err) {
    console.error("Error al validar paciente", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getPacientes = async (req, res) => {
  try {
    const pacientes = await PacienteModel.getPacientes();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
};

export const getPaciente = async (req, res) => {
  const { cedula } = req.params;
  try {
    const paciente = await PacienteModel.getPacientePorCedula(cedula);
    if (!paciente) return res.status(404).json({ existe: false });
    res.json({ existe: true, paciente });
  } catch (err) {
    res.status(500).json({ error: "Error al buscar paciente" });
  }
};