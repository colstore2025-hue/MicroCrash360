import express from "express";
import "./jobs/collectionJob.js";

const app = express();

app.get("/", (req, res) => {
  res.send("MicroCash360 Backend Running 🚀");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});