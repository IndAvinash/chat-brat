const { signup, login } = require("../Controllers/AuthController");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const { authenticateToken  } = require("../Middlewares/AuthMiddleware");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
module.exports = router;