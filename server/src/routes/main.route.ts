import { Router } from "express";
import authRouter from "./auth.route";
import healthRouter from "./health.route";
import sseRouter from "./sse.route";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/health", healthRouter);
mainRouter.use("/sse", sseRouter);

export default mainRouter;
