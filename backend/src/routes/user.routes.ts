import { Router } from "express";
import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getAllUserController, getCurrentUser } from "../controllers/userController";

const router = Router();

router.post("/login", loginController);
router.post("/signup", signupController);
router.delete("/logout", logoutController);
router.get("/all", authMiddleware, getAllUserController)
router.get("/", authMiddleware, getCurrentUser);

export default router;
