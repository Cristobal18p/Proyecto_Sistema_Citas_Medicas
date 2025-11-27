import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


// Importar rutas
import pacienteRoutes from './routes/paciente.routes.js';
import medicoRoutes from './routes/medico.routes.js';
import citaRoutes from './routes/cita.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import especialidadesRoutes from './routes/especialidad.routes.js'; 
import authRoutes from './routes/auth.routes.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/especialidades', especialidadesRoutes); 
app.use('/api/auth', authRoutes); 



app.get('/', (req, res) => res.send('API Clínica Médica funcionando correctamente'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
