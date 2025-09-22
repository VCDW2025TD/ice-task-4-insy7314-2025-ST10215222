const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
// Security middlewares
app.use(helmet());
app.use(cors({
  origin: "https://localhost:5173",
  credentials: true
}));


app.use(express.json({ type: ["application/json", "application/csp-report"] })); // Parse JSON bodies
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],     // blocks inline/eval and external scripts
  styleSrc: ["'self'"],      // blocks inline/external styles
  imgSrc: ["'self'"],        // images must come from your origin
  connectSrc: ["'self'"],    // blocks fetch/XHR/WebSocket to external origins
  frameAncestors: ["'none'"],// prevents clickjacking
  upgradeInsecureRequests: [] // optional, upgrade http->https automatically
};

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      ...cspDirectives,
      "report-uri": ["/csp-report"], // send violation reports here
    },
    reportOnly: process.env.NODE_ENV !== "production", // report-only in dev
  })
);
// Routes
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    timestamp: new Date()
  });
});
app.post("/csp-report", (req, res) => {
  console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

// Example health route
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SecureBlog API running at http://localhost:${PORT}`);
  console.log(
    `CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`
  );
});
module.exports = app;