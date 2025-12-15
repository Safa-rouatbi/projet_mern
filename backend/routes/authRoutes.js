const express = require('express');
const router = express.Router();

const validate = require('../middleware/validation');
const { registerSchema, loginSchema } = require('../validations/auth_valid');
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');


router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', auth, (req, res) => {
  res.json({
    message: 'Token valide',
    user: req.user
  });
});


module.exports = router;
