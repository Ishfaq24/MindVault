import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../../config/env.js";
import type { JwtPayload as AuthJwtPayload } from "../types/jwt-payload.js";

export function generateAccessToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
}

export function generateRefreshToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
}

export function verifyAccessToken(token: string): AuthJwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthJwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  ) as {
    userId: string;
    email: string;
    role: string;
  };
}
