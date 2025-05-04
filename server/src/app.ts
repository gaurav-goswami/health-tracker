/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Server as IOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mainRouter from "./routes/main.route";
import logger from "./config/logger";
import { HttpError } from "http-errors";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
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

const appServer: HTTPServer = createServer(app);
const io = new IOServer(appServer, {
  cors: {
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
  },
});

export const userSocketMap = new Map<string, string>();

io.on("connection", (socket) => {
  logger.info(`WS Connected: ${socket.id}`);
  socket.on("register", (userId: string) => {
    userSocketMap.set(userId, socket.id);
    logger.info(`USER ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
    logger.info(`WS Disconnected: ${socket.id}`);
  });
});

export { app, appServer, io };
