const authService = require("../services/authService");

// Registro
const register = (req, res) => {
  const { username, password } = req.body;
  authService.register(username, password, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Usuario registrado con éxito", user });
  });
};

// Login
const login = (req, res) => {
  const { username, password } = req.body;
  authService.login(username, password, (err, result) => {
    if (err) return res.status(401).json({ error: err.message });
    res.json(result);
  });
};

module.exports = { register, login };
