import { scalarTypeDefs } from "./scalars.js";

import { healthTypeDefs } from "../modules/health/index.js";
import { authTypeDefs } from "../modules/auth/index.js";
import { uploadTypeDefs } from "../modules/uploads/index.js";

export const typeDefs = [
  scalarTypeDefs,
  healthTypeDefs,
  authTypeDefs,
  uploadTypeDefs,
];