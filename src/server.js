const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");

const logRoutes = require("./routes/logRoutes");

const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use("/log", logRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Potens Log Service Running",
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});