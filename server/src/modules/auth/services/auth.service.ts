import crypto from "node:crypto";

import { AuthRepository } from "../repositories/auth.repository.js";
import { RegisterDTO } from "../dto/register.dto.js";
import { LoginDTO } from "../dto/login.dto.js";
import { RefreshTokenDTO } from "../dto/refresh-token.dto.js";
import { ChangePasswordDTO } from "../dto/change-password.dto.js";

import { comparePassword, hashPassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export class AuthService {
  private readonly authRepository = new AuthRepository();

  async register(data: RegisterDTO) {
    const existingEmail = await this.authRepository.findUserByEmail(
      data.email
    );

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const existingUsername =
      await this.authRepository.findUserByUsername(
        data.username
      );

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await this.authRepository.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash,
    });

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
    const user = await this.authRepository.findUserByEmail(
      data.email
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

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
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
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

  async me(userId: string) {
    const user = await this.authRepository.findUserById(
      userId
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async refreshToken(input: RefreshTokenDTO) {
    // Verify JWT
    const payload = verifyRefreshToken(input.refreshToken);

    // Hash incoming refresh token
    const hashedToken = crypto
      .createHash("sha256")
      .update(input.refreshToken)
      .digest("hex");

    // Find stored refresh token
    const storedToken =
      await this.authRepository.findRefreshToken(
        hashedToken
      );

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    // Check expiration
    if (storedToken.expiresAt < new Date()) {
      throw new Error("Refresh token expired");
    }

    // Get user
    const user = await this.authRepository.findUserById(
      payload.userId
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Revoke old refresh token
    await this.authRepository.revokeRefreshToken(
      storedToken.id
    );

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken =
      generateAccessToken(tokenPayload);

    const refreshToken =
      generateRefreshToken(tokenPayload);

    // Hash new refresh token
    const refreshHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Store new refresh token
    await this.authRepository.createRefreshToken({
      tokenHash: refreshHash,
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
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
  async logout(input: RefreshTokenDTO) {
    // Hash incoming refresh token
    const hashedToken = crypto
      .createHash("sha256")
      .update(input.refreshToken)
      .digest("hex");

    // Find stored refresh token
    const storedToken =
      await this.authRepository.findRefreshToken(
        hashedToken
      );

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    // Revoke refresh token
    await this.authRepository.revokeRefreshToken(
      storedToken.id
    );

    return {
      success: true,
      message: "Successfully logged out",
    };
    }

    async changePassword(
  userId: string,
  input: ChangePasswordDTO
) {
  const user = await this.authRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await comparePassword(
    input.currentPassword,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  if (input.currentPassword === input.newPassword) {
    throw new Error(
      "New password must be different from current password"
    );
  }

  const passwordHash = await hashPassword(
    input.newPassword
  );

  await this.authRepository.updatePassword(
    user.id,
    passwordHash
  );

  await this.authRepository.revokeAllRefreshTokens(
    user.id
  );

  return {
    success: true,
    message:
      "Password changed successfully. Please login again.",
  };
}
  }