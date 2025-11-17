 
const express = require('express');
const requireAuth = require('../middlewares/auth');
const router = express.Router();

router.get('/menu', (req, res) => {
  res.json([
    { name: "Caramel Macchiato", price: 4.00 },
    { name: "Vanilla Latte", price: 3.00 }
  ]);
});

router.get('/cafes', (req, res) => {
  res.json([
    { name: "Cavosh Cafe", address: "Legnicka 5, Wroclaw" }
  ]);
});

router.post('/profile', requireAuth, (req, res) => {
  res.json({
    fullName: req.user.fullName,
    email: req.user.email,
    points: req.user.points
  });
});

module.exports = router;