import express from "express";

const app = express();

const PORT = Number(process.env.PORT) || 4000;

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "MindVault Backend is running 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});