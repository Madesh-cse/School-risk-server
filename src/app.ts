import express from "express"
import cors from "cors"
import dashboardRoutes from "./routes/dashboard";
import riskRoutes from "./routes/risk";
import SchoolRoutes from "./routes/school"
import trendRoutes from "./routes/trend";
import reportRoutes from "./routes/report"
import summaryRoutes from "./routes/summary";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/risks", riskRoutes);
app.use("/api/schools", SchoolRoutes);
app.use("/api/trends", trendRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/summary", summaryRoutes);

app.get("/", (req,res)=>{
    res.send("Hello World");
})

console.log("APP.TS LOADED");

app.get("/test", (req, res) => {
  res.json({ message: "test route working" });
});

export default app;