import { scalarTypeDefs } from "./scalars.js";

import { healthTypeDefs } from "../modules/health/index.js";
import { authTypeDefs } from "../modules/auth/index.js";
import { uploadTypeDefs } from "../modules/uploads/index.js";
import { searchTypeDefs } from "../modules/search/index.js";
import { chatTypeDefs } from "../modules/chat/index.js";
import { documentTypeDefs } from "../modules/documents/index.js";

export const typeDefs = [
  scalarTypeDefs,
  healthTypeDefs,
  authTypeDefs,
  uploadTypeDefs,
  searchTypeDefs,
  chatTypeDefs,
  documentTypeDefs,
];
