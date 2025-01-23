import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import servicesRouter from "./routes/servicefinder.route";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/services", servicesRouter);

// Start Server
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
