import { JwtPayload } from "jsonwebtoken";
import { TCookieSetter } from "../types/type";

export const cookieSetter = async ({ user, res, generateToken }: TCookieSetter) => {
  if (!user) throw new Error("User is undefined");

  const jwtPayload: JwtPayload = {
    sub: user.id,
    email: user.email,
  };

  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const accessToken: string = await generateToken(jwtPayload, String(ACCESS_TOKEN_SECRET), {
    issuer: "health-tracker",
    expiresIn: "10d",
  });

  res.cookie("accessToken", accessToken, {
    domain: "localhost",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 10,
    httpOnly: true,
  });
};
