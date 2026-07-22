import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { uploadRoutes } from "../modules/uploads/index.js";
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// app.use(helmet());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// REST Routes
app.use("/api/uploads", uploadRoutes);

export default app;