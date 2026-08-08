require("dotenv").config();
const helmet = require("helmet");
const {
    apiLimiter,
    loginLimiter,
    appointmentLimiter
} = require("./middleware/rateLimiter");
const express = require("express");
const cors = require("cors");

const supabase = require("./config/supabase");

const appointmentRoutes = require("./routes/appointments");
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/services");
const offerRoutes = require("./routes/offers");
const whatsappRoutes = require("./routes/whatsapp");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "https://golden-touch-frontend.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(helmet());

app.use(express.json({
    limit: "10mb"
}));

app.disable("x-powered-by");

// Health Check
app.get("/api/health", async (req, res) => {
    try {
        const { error } = await supabase
            .from("appointments")
            .select("id")
            .limit(1);

        res.json({
            status: "ok",
            database: error ? "disconnected" : "connected"
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            database: "disconnected"
        });
    }
});


// Routes
app.use("/api", apiLimiter);
app.use("/api/appointments", appointmentLimiter, appointmentRoutes);
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: "Internal Server Error"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});