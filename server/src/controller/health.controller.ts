import { HealthStatus } from "@prisma/client";
import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../config/db";
import logger from "../config/logger";
import Queue from "../lib/queue";
import { healthSchema } from "../resolvers/resolvers";
import { broadcastHealthUpdates } from "../routes/sse.route";
import { AuthRequest } from "../types/type";
import { getRedisKeyValue, setRedisKeyValue } from "../utils/redis-helper";

export class HealthController {
  constructor() { }

  async createRecord(req: AuthRequest, res: Response, next: NextFunction) {
    const parsedBody = healthSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = createHttpError(400, parsedBody.error.message);
      return next(error);
    }

    try {
      const user = await this.findUser(req);

      const { name, age, status } = parsedBody.data;

      const record = await prisma.healthRecord.create({
        data: {
          name,
          age,
          status: status as HealthStatus,
        },
      });

      await setRedisKeyValue(record.id, JSON.stringify(record), 300);

      broadcastHealthUpdates({
        type: "CREATED",
        record,
        by: user
      })
      await Queue.publish("health_updates", {
        message: "New record created",
        record,
        type: "CREATED",
        createdBy: {
          email: user.email,
          id: user.id,
        },
      });

      res.json({ message: "Health record created", record });
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
      const user = await this.findUser(req);

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

      const record = await prisma.healthRecord.update({
        where: {
          id,
        },
        data: {
          name,
          age,
          status: status as HealthStatus,
        },
      });

      broadcastHealthUpdates({
        type: "UPDATED",
        record,
        by: user
      })
      await Queue.publish("health_updates", {
        message: "Record updated",
        type: "UPDATED",
        record,
        createdBy: {
          email: user.email,
          id: user.id,
        },
      });
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

  async getHealthRecord(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.findUser(req);

      // TODO: Add pagination
      const healthRecords = await prisma.healthRecord.findMany({});

      if (!healthRecords.length) {
        return res.json({ message: "No health records available", records: [] });
      };

      return res.json({
        records: healthRecords
      })

    } catch (error) {
      logger.error("Error while getting health records");
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
    return user;
  }
}
