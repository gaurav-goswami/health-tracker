import { NextFunction, Router, Request, Response } from "express";
import authenticate from "../middleware/authenticate";
import { HealthController } from "../controller/health.controller";
import { AuthRequest } from "../types/type";

const healthRouter = Router();
const healthController = new HealthController();

healthRouter.post("", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await healthController.createRecord(req as AuthRequest, res, next);
  } catch (error) {
    next(error);
  }
});

healthRouter.put("/:id", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await healthController.updateRecord(req as AuthRequest, res, next);
  } catch (error) {
    next(error);
  }
});

healthRouter.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await healthController.deleteRecord(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  }
);

healthRouter.get("", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await healthController.getHealthRecord(req as AuthRequest, res, next);
  } catch (error) {
    next(error);
  }
});

healthRouter.get("/:id", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await healthController.getSingleRecord(req as AuthRequest, res, next);
  } catch (error) {
    next(error);
  }
});

export default healthRouter;
