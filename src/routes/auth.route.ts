import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { default as TokenAndCredentialsService } from "../services/token-and-credentials-service";

const authRouter = Router();

const token_and_credentials_service = new TokenAndCredentialsService();

const authController = new AuthController(token_and_credentials_service);

authRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authController.login(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
