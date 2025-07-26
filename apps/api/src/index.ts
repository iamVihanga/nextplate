import createApp from "@api/lib/create-app";
import configureOpenAPI from "@api/lib/open-api-config";
import { registerRoutes } from "@api/routes/registry";

import env from "./env";

const app = registerRoutes(createApp());

configureOpenAPI(app);

export type AppType = typeof app;

export default {
  port: env.PORT,
  fetch: app.fetch
};

// Test
