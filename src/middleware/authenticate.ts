import { expressjwt } from "express-jwt";
import { Secret } from "jsonwebtoken";
import { Request } from "express";

// expressJwt will decode the token and extract the user-info and will add that in a auth object inside the request.
export default expressjwt({
  secret: process.env.ACCESS_TOKEN_SECRET as Secret,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    // checking if the auth token exists in the headers (['Bearer accessToken']) or not
    const header = req.headers.authorization;
    // ["Bearer Token"]
    const token = header?.split(" ")[1];
    if (header && token !== undefined) {
      if (token) {
        return token;
      }
    }
    // checking the token inside cookie
    const { accessToken } = req.cookies as { accessToken: string };
    return accessToken;
  },
});
