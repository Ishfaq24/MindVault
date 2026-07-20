import { verifyAccessToken } from "../modules/auth/utils/jwt.js";

export interface GraphQLUser {
  userId: string;
  email: string;
  role: string;
}

export interface GraphQLContext {
  user: GraphQLUser | null;
}

export async function createContext({
  req,
}: {
  req: {
    headers: Record<string, string | string[] | undefined>;
  };
}): Promise<GraphQLContext> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return {
      user: null,
    };
  }

  if (!authHeader.startsWith("Bearer ")) {
    return {
      user: null,
    };
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);

    return {
      user: payload,
    };
  } catch {
    return {
      user: null,
    };
  }
}