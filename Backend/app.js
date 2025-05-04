// app.js
import "dotenv/config"; // 1️⃣ load .env variables
import express from "express"; // 2️⃣ Express framework
import morgan from "morgan"; // 3️⃣ HTTP request logger
import cors from "cors"; // 4️⃣ enable CORS

// 5️⃣ route modules
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

// 6️⃣ middleware
app.use(morgan("dev")); // → logs each request to console
app.use(cors()); // → allows cross-origin requests
app.use(express.json()); // → parses JSON bodies

// 7️⃣ mount your student endpoints
//    all routes in routes/studentRoutes.js will be prefixed with /students
app.use("/students", studentRoutes);

// 8️⃣ health‐check endpoint
app.get("/", (req, res) => {
  res.json({ message: "FYP Management API is up and running!" });
});

// 9️⃣ global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// 🔟 start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
