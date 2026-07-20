import crypto from "node:crypto";

import { AuthRepository } from "../repositories/auth.repository.js";
import { RegisterDTO } from "../dto/register.dto.js";
import { LoginDTO } from "../dto/login.dto.js";
import { comparePassword } from "../utils/password.js";
import { hashPassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

export class AuthService {
  private readonly authRepository = new AuthRepository();

  async register(data: RegisterDTO) {
    // Check email
    const existingEmail = await this.authRepository.findUserByEmail(
      data.email
    );

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Check username
    const existingUsername =
      await this.authRepository.findUserByUsername(
        data.username
      );

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await this.authRepository.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash,
    });

    // JWT Payload
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate Tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Hash Refresh Token
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Store Refresh Token
    await this.authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  async login(data: LoginDTO) {
  const user = await this.authRepository.findUserByEmail(data.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }
  console.log("Login Email:", data.email);
console.log("User Found:", user);
  const isPasswordValid = await comparePassword(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await this.authRepository.createRefreshToken({
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    user: {
      connect: {
        id: user.id,
      },
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
}
}