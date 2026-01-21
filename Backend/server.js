import express from "express";
import connectDB from "./src/config/mongoDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'

dotenv.config();
const app = express();
connectDB();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Api working....");
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => console.log(`server listening`));
