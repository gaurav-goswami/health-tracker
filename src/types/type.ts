 
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { Response } from "express";

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
