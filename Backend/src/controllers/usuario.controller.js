import * as UsuarioModel from '../models/usuario.model.js';

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.getAllUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsuario = async (req, res) => {
  try {
    const usuario = await UsuarioModel.getUsuarioById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const nuevo = await UsuarioModel.createUsuario(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const actualizado = await UsuarioModel.updateUsuario(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const resultado = await UsuarioModel.deleteUsuario(req.params.id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
