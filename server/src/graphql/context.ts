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

  if (!authHeader || Array.isArray(authHeader)) {
    
    return {
      user: null,
    };
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log("Authorization header is not Bearer.");
    return {
      user: null,
    };
  }

  const token = authHeader.replace("Bearer ", "");

  console.log("Access Token:", token);

  try {
    const payload = verifyAccessToken(token);

    console.log("JWT Payload:", payload);

    return {
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    };
  } catch (error) {
    console.error("JWT Verification Error:", error);

    return {
      user: null,
    };
  }
}
