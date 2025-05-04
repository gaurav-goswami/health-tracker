/* eslint-disable @typescript-eslint/no-misused-promises */
import { Server as IOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import express, { Express } from "express";
import logger from "../config/logger";

const app: Express = express();
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
