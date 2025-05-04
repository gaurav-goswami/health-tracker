import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import mainRouter from "./routes/main.route";
import cookieParser from "cookie-parser";
import { app } from "./lib/socket";
import cors from "cors";

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000" as string,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}))
app.use("/api/v1", mainRouter);

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
