import {findAllEspecialidades} from '../models/especialidad.model.js';
export const getEspecialidades = async (req, res) => {
  try {
    const especialidades = await findAllEspecialidades();
    res.json(especialidades);
  } catch (err) {
    console.error("Error al obtener especialidades", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
