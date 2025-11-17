require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/app');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', appRoutes);

const PORT = process.env.PORT || 3000;

// Sincroniza modelos (crea tablas si no existen)
sequelize.sync({ force: false }) // Cambia a true solo la primera vez
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`API corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar DB:', err);
  });