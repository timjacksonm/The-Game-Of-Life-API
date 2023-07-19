import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import ApiKey from "../models/apikey.model";
dotenv.config();

export const authcheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.header("apikey")) {
    return res.status(401).json({
      message: "Invalid request. Must include apikey header",
    });
  }
  const apikey = await ApiKey.findOne({
    apiKey: req.header("apikey"),
    environment: process.env.NODE_ENV,
    isActive: true,
    expiresAt: { $gte: new Date() },
  });

  console.log(apikey);

  if (!apikey) {
    return res.status(401).json({
      message: "Invalid apikey",
    });
  }

  next();
};
