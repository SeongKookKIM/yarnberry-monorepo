import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";

import test from "./router/test";

const app = express();

app.use(express.urlencoded({ extended: true }));

// React Server.js 연결
app.use(express.json());
app.use(cors());

app.listen("8080", () => {
  console.log(`
        #############################################
        🛡️ Server listening on port: 8000 🛡️
        #############################################  
    `);
});

// server-react connect
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", function (req, res) {
  console.log(req);
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.use("/", (req, res) => {
  console.log(req.body);
  return res.status(200).send("하이");
});

app.use("/test", test);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
