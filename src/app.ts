import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
      },
    ],
  });
});

export default app;
