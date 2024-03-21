import express, { Request, Response, NextFunction } from "express";

let test = express.Router();

test.post("/", (req, res) => {
  console.log(req.body);
  return res.status(200).send("test 안녕");
});
export default test;
