import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// import userRoutes from "./routes/userRoutes.js";
import foodRoutes from "./routes/food.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Chỉ cho phép domain này
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức cho phép
  credentials: true, // Cho phép gửi cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/images", express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  connectDB();
});
