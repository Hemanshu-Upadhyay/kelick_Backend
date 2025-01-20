import express from "express";
import { getTaxData } from "../controllers/taxDataController.js";

export const taxDataRoutes = express.Router();

taxDataRoutes.get("/:userId", getTaxData);
