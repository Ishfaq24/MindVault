import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../database/prisma.js";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }
  

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    
    return prisma.refreshToken.create({
      data,
    });
  }
  async findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}
async findRefreshToken(tokenHash: string) {
  return prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
    },
  });
}

async revokeRefreshToken(id: string) {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

async updatePassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
  });
}

async revokeAllRefreshTokens(userId: string) {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

}