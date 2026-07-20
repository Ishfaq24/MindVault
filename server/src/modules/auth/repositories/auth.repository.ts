import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../database/prisma.js";

console.log("Prisma instance:", prisma);
console.log("prisma.user:", prisma.user);
console.log("prisma.refreshToken:", prisma.refreshToken);;

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
    console.log("prisma.user:", prisma.user);
console.log("prisma.refreshToken:", prisma.refreshToken);
    console.log(prisma);
    return prisma.refreshToken.create({
      data,
    });
  }
}