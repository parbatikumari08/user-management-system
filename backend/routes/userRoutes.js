import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateOwnProfile, 
} from "../controllers/userController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Profile route (MUST be before /:id route)
router.put("/profile", protect, updateOwnProfile);

// Admin & Manager routes
router.get("/", protect, authorizeRoles("admin", "manager"), getUsers);
router.get("/:id", protect, authorizeRoles("admin", "manager"), getUserById);

// Admin only routes
router.post("/", protect, authorizeRoles("admin"), createUser);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;