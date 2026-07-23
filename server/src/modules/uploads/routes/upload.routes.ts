import { Router } from "express";

import { UploadController } from "../controllers/upload.controller.js";
import { uploadMiddleware } from "../middleware/multer.middleware.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

const controller = new UploadController();
console.log("Upload routes loaded");
router.use(authenticate);

router.post(
  "/",
  uploadMiddleware.single("file"),
  controller.upload
);

router.get(
  "/",
  controller.list
);

router.get(
  "/:id",
  controller.get
);

router.get(
  "/:id/download",
  controller.download
);

router.post(
  "/:id/reingest",
  controller.reingest
);

router.patch(
  "/:id",
  controller.rename
);

router.delete(
  "/:id",
  controller.delete
);

export default router;