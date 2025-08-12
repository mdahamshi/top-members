import express from "express";
import {
  authMembers,
  authLogin,
  authLogout,
} from "../controllers/authController.js";
import {
  ensureAuthenticated,
  ensureAdmin,
  ensureSelfOrAdmin,
} from "../middleware/auth.js";

const router = express.Router();

router.post("/", authLogin);
router.get("/", ensureAuthenticated, authLogout);
router.put("/", ensureAuthenticated, authMembers);
export default router;
