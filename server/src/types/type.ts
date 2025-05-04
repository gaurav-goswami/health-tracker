import { JwtPayload, SignOptions } from "jsonwebtoken";
import { Response, Request } from "express";

export type TUser = {
  id: string;
  email: string;
  password: string;
  firstName: string;
};

export type TCookieSetter = {
  user: TUser;
  generateToken: (payload: JwtPayload, secret: string, options: SignOptions) => Promise<string>;
  res: Response;
};

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    email: string;
  };
}
