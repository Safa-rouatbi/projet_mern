const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//REGISTER
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Vérifier si email existe
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email déjà utilisé" });

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "Utilisateur créé",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Vérifier utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Identifiants incorrects" });

    // Vérifier mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Identifiants incorrects" });

    // Créer token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login réussi",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  register,
  login
};
