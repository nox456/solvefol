import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", AuthController.signup);
authRouter.post("/signin", AuthController.signin);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/is-authenticated", AuthController.isAuthenticated);

export default authRouter;
