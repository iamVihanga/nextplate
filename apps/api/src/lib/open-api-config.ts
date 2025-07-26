import { apiReference } from "@scalar/hono-api-reference";

import { AppOpenAPI } from "@api/types";

import packageJson from "../../package.json";
import { BASE_PATH } from "./constants";

export default function configureOpenAPI(app: AppOpenAPI): void {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "Hono Advanced API with Bun"
    }
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      url: `${BASE_PATH}/doc`
    })
  );
}
