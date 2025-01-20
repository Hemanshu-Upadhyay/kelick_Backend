import express from "express";
import { getTaxData } from "../controllers/taxDataController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

export const taxDataRoutes = express.Router();

taxDataRoutes.get("/:userId", authenticate, getTaxData);
