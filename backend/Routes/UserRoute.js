import express from "express";
import { getUsers, Register, Login } from "../Controllers/UserControl.js";
import { verifyToken } from "./../middleware/VerifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/register", Register);
router.post("/login", Login);

export default router;
