export interface JwtPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}