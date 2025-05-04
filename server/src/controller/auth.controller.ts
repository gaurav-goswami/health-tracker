import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import TokenAndCredentialsService from "../services/token-and-credentials-service";
import { loginSchema } from "../resolvers/resolvers";
import prisma from "../config/db";
import createHttpError from "http-errors";
import { cookieSetter } from "../utils/cookieHelper";

export class AuthController {
  constructor(private token_and_credentials_service: TokenAndCredentialsService) { }

  async login(req: Request, res: Response, next: NextFunction) {
    const parsedBody = loginSchema.safeParse(req.body);
    if (!parsedBody.success) {
      const error = createHttpError(400, parsedBody.error.message);
      return next(error);
    }

    try {
      const { email, password } = parsedBody.data;
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        const error = createHttpError(400, "Invalid credentials");
        return next(error);
      }

      const matchPass = await this.token_and_credentials_service.comparePassword(
        password,
        user.password
      );
      if (!matchPass) return next(createHttpError(400, "Invalid credentials"));

      await cookieSetter({
        user,
        res,
        generateToken: this.token_and_credentials_service.generateToken,
      });

      return res.json({
        message: "Login successful",
        user
      });
    } catch (error) {
      logger.error("Error while login", error);
      next(error);
    }
  }
}
