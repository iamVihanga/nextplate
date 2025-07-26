import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import type { AppBindings, AppOpenAPI } from "@api/types";

import env from "@api/env";
import { BASE_PATH } from "@api/lib/constants";
import { logger } from "@api/middlewares/pino-logger";
import { cors } from "hono/cors";
import { auth } from "./auth";

export const createRouter = function (): OpenAPIHono<AppBindings> {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook
  });
};

export default function createApp(): OpenAPIHono<AppBindings> {
  const app = createRouter().basePath(BASE_PATH) as AppOpenAPI;

  // Middleware
  app.use(serveEmojiFavicon("🚀"));
  app.use(logger());

  // ------ CORS Middleware ------
  app.use(
    "*", // "*" enables cors for all routes
    cors({
      origin: [env.CLIENT_APP_URL], // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true
    })
  );

  // -------------------------------------------------
  // Better auth Authentication Middleware
  app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  });

  app.on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });
  // -------------------------------------------------

  // Error Handelling Middleware
  app.onError(onError);

  // Not Found Handelling Middleware
  app.notFound(notFound);

  return app;
}
