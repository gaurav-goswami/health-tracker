import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

class TokenAndCredentialsService {
  constructor() {}

  generateToken = (
    payload: JwtPayload,
    secret: string | Buffer,
    options: SignOptions
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!payload || !secret || !options) {
        return reject(new Error("Pass all the required arguments"));
      }

      const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        issuer: options.issuer,
        expiresIn: options.expiresIn || "10d",
      });

      resolve(token);
    });
  };

  async hashPassword(password: string) {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  }
  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export default TokenAndCredentialsService;
