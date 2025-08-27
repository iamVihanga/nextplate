import createApp from "@api/lib/create-app";
import configureOpenAPI from "@api/lib/open-api-config";
import { registerRoutes } from "@api/routes/registry";

const app = registerRoutes(createApp());

configureOpenAPI(app);

export type AppType = typeof app;

export default app;
