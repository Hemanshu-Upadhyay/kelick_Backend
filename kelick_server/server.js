import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { logger } from "./config/logger.js";
import { rateLimiter } from "./middlewares/rateLimiterMiddleware.js";
import { authenticate } from "./middlewares/authMiddleware.js";
import { taxDataRoutes } from "./routes/taxDataRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { schema } from "./graphql/schema.js";
import { root } from "./graphql/resolvers.js";
import { taxDataJobProcessor } from "./jobs/taxDataJobProcessor.js";

const app = express();

app.use(bodyParser.json());
app.use(rateLimiter);

// Authentication routes for login and signup
app.use("/auth", authRoutes); // Add the auth routes at the '/auth' endpoint

// GraphQL setup with JWT authentication
app.use(
  "/graphql",
  authenticate,
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use("/tax-data", taxDataRoutes);

// Background job processing
taxDataJobProcessor();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
