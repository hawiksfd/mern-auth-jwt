import express from "express";
import { getUsers, Register } from "../Controllers/UserControl.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/register", Register);

export default router;
