import { configDotenv } from "dotenv";
import express from "express";
import { createServer } from "http";
import { SocketManager } from "./services/SocketManager";
import cors from "cors";
import routes from "./routes/index";
import cookieParser from "cookie-parser";

configDotenv();
const port = process.env.PORT;
const app = express();
const server = createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "https://ping-service.vercel.app",
  })
);

app.use("/api/v1", routes);

SocketManager.getInstance(server);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "server is up",
  });
});

server.listen(port, () => {
  console.log("server is up at: " + port);
});
