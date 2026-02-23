const express = require("express");
const router = express.Router();
const AuthController = require("../Controller/AuthController");

const AuthMiddleware = require("../Middleware/authMiddleware");

router.post("/signup", AuthController.Signup);
router.post("/login", AuthController.Login);
router.get("/users", AuthMiddleware, AuthController.searchUsers);

module.exports = router;