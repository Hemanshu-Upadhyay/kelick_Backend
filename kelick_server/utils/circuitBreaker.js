import opossum from "opossum";
import { irasService } from "../services/irasService.js";

export const irasCircuitBreaker = new opossum(irasService, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
});
