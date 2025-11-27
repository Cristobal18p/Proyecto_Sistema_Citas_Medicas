import * as HistorialModel from '../models/historial.model.js';

export const getHistoriales = async (req, res) => {
  try {
    const data = await HistorialModel.getAllHistorial();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHistorial = async (req, res) => {
  try {
    const historial = await HistorialModel.getHistorialById(req.params.id);
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });
    res.json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createHistorial = async (req, res) => {
  try {
    const nuevo = await HistorialModel.createHistorial(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHistorial = async (req, res) => {
  try {
    const actualizado = await HistorialModel.updateHistorial(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHistorial = async (req, res) => {
  try {
    const resultado = await HistorialModel.deleteHistorial(req.params.id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
