 
module.exports = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return res.status(401).json({ msg: 'Falta userId' });

  const User = require('../models/User');
  const user = await User.findByPk(userId);
  if (!user) return res.status(401).json({ msg: 'Usuario no encontrado' });

  req.user = user;
  next();
};