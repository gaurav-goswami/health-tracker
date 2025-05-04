import { Router } from "express";
import authRouter from "./auth.route";
import healthRouter from "./health.route";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/health", healthRouter);

export default mainRouter;
