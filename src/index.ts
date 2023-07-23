import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import home from "./controllers/home";
import wikiRoutes from "./controllers/WikiCollectionController";
import customRoutes from "./controllers/CustomCollectionController";
import {
  error,
  errorLogger,
  errorResponder,
  info,
  invalidPathHandler,
} from "./logger";
import { authcheck } from "./utils/authcheck";

const whitelist = process.env.SITES?.split(", ");

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(compression());

app.use(helmet());

app.use(
  cors({
    origin: whitelist,
    methods: "GET, POST, DELETE",
  })
);

//logs any incoming requests
app.use(morgan("dev", { stream: { write: (msg) => info(msg) } }));

//Set up mongoose connection
const mongoDB = (process.env.PROD_DB_URL || process.env.DEV_DB_URL) ?? "";
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", (err: { message: string }) =>
  error("MongoDB connection error: " + err.message)
);
db.on("connected", () => info("MongoDB connection established successfully"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.set("trust proxy", 1);

app.get("/", home);
app.use("/", authcheck);
app.use("/", wikiRoutes);
app.use("/", customRoutes);

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

app.listen(PORT, () =>
  info(`CORS-enabled web server listening on port ${PORT}`)
);
