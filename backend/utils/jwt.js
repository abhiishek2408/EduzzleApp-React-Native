import jwt from "jsonwebtoken";

const { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } = process.env;

export const signAccessToken = (payload) =>
  jwt.sign(payload, JWT_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: ACCESS_TOKEN_TTL,
  });

export const signRefreshToken = (payload, jti) =>
  jwt.sign({ ...payload, jti }, JWT_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: REFRESH_TOKEN_TTL,
  });

export const verifyToken = (token) =>
  jwt.verify(token, JWT_PUBLIC_KEY, { algorithms: ["RS256"] });
