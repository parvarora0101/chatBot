import "./config/env.js";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Replace this with your actual Vercel frontend URL
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-bot-v1-rho.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Chatbot server is running.");
});

app.use("/api", chatRoutes);

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set.");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});