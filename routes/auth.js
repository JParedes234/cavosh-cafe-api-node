  
const express = require('express');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ msg: 'Email ya existe' });

    const user = await User.create({ fullName, email, password });
    res.json({ msg: 'Registrado', userId: user.id, fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(400).json({ msg: 'Credenciales inválidas' });
  }
  res.json({ msg: 'Login OK', userId: user.id, fullName: user.fullName });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ msg: 'Email no encontrado' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;
  user.resetCodeExpiry = new Date(Date.now() + 3600000);
  await user.save();

  await sendEmail(email, 'Código de recuperación', `Tu código es: ${code}`);
  res.json({ msg: 'Código enviado' });
});

router.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({
    where: {
      email,
      resetCode: code,
      resetCodeExpiry: { [require('sequelize').Op.gt]: new Date() }
    }
  });
  if (!user) return res.status(400).json({ msg: 'Código inválido' });
  res.json({ msg: 'Código válido' });
});

router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({
    where: {
      email,
      resetCode: code,
      resetCodeExpiry: { [require('sequelize').Op.gt]: new Date() }
    }
  });
  if (!user) return res.status(400).json({ msg: 'Código inválido' });

  user.password = newPassword;
  user.resetCode = null;
  user.resetCodeExpiry = null;
  await user.save();

  res.json({ msg: 'Contraseña cambiada' });
});

module.exports = router;