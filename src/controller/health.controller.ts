import { NextFunction, Response } from "express";
import logger from "../config/logger";
import { AuthRequest } from "../types/type";
import prisma from "../config/db";
import createHttpError from "http-errors";
import { healthSchema } from "../resolvers/resolvers";
import { HealthStatus } from "@prisma/client";
import { getRedisKeyValue, setRedisKeyValue } from "../utils/redis-helper";

export class HealthController {
  constructor() {}

  async createRecord(req: AuthRequest, res: Response, next: NextFunction) {
    const parsedBody = healthSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = createHttpError(400, parsedBody.error.message);
      return next(error);
    }

    try {
      await this.findUser(req);

      const { name, age, status } = parsedBody.data;

      const record = await prisma.healthRecord.create({
        data: {
          name,
          age,
          status: status as HealthStatus,
        },
      });

      // TODO: Send an event to rabbitMQ after record is created and store in the log file and broadcast to other users via websocket
      await setRedisKeyValue(record.id, JSON.stringify(record), 300);
      logger.info(record);
      res.json({ message: "Health record created" });
    } catch (error) {
      logger.error("Error while creating health record");
      return next(error);
    }
  }

  async updateRecord(req: AuthRequest, res: Response, next: NextFunction) {
    const parsedBody = healthSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = createHttpError(400, parsedBody.error.message);
      return next(error);
    }

    const { id } = req.params;
    try {
      await this.findUser(req);

      const healthRecord = await prisma.healthRecord.findFirst({
        where: {
          id,
        },
      });

      if (!healthRecord) {
        const error = createHttpError(404, "Health record does not exists");
        return next(error);
      }

      const { name, age, status } = parsedBody.data;

      await prisma.healthRecord.update({
        where: {
          id,
        },
        data: {
          name,
          age,
          status: status as HealthStatus,
        },
      });

      // TODO: send a notification via websocket and show live update via SSE.
      // TODO: trigger an event for logging (RMQ)

      logger.info({ recordId: id, message: "Health record updated successfully" });
      res.json({
        message: "Health record updated",
      });
    } catch (error) {
      logger.error("Error while updating the health record", error);
      return next(error);
    }
  }

  async deleteRecord(req: AuthRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.findUser(req);
      const record = await prisma.healthRecord.findFirst({
        where: {
          id,
        },
      });

      if (!record) {
        const error = createHttpError(404, "Health record does not exist");
        return next(error);
      }

      await prisma.healthRecord.delete({
        where: {
          id: record.id,
        },
      });

      res.json({ message: "Health record deleted successfully" });
    } catch (error) {
      logger.error("Error while deleting health record", error);
      return next(error);
    }
  }

  async getSingleRecord(req: AuthRequest, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      await this.findUser(req);
      // TODO: fetch from redis first, if not present inside redis get from DB (store again in redis);
      const cachedRecord = await getRedisKeyValue(id);

      if (cachedRecord) {
        return res.json(JSON.parse(cachedRecord));
      }

      const record = await prisma.healthRecord.findFirst({
        where: {
          id,
        },
      });

      if (!record) {
        const error = createHttpError(404, "Health record does not exist");
        return next(error);
      }

      await setRedisKeyValue(record.id, JSON.stringify(record), 300);
      res.json({ record });
    } catch (error) {
      logger.error("Error while getting a single record");
      return next(error);
    }
  }

  private async findUser(req: AuthRequest) {
    const { sub } = req.auth;
    const user = await prisma.user.findFirst({
      where: {
        id: sub,
      },
    });
    if (!user) {
      const error = createHttpError(404, "User does not exists");
      throw error;
    }
    return true;
  }
}
