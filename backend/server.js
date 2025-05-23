import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { router } from "./routes/user-routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", router);

const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
