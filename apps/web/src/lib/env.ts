import { z, ZodError } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  NEXT_PUBLIC_BACKEND_URL: z.string().optional(),

  NEXT_PUBLIC_AWS_REGION: z.string().optional(),
  NEXT_PUBLIC_AWS_ACCESS_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: z.string().optional(),
  NEXT_PUBLIC_AWS_S3_BUCKET: z.string().optional()
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env = EnvSchema.parse(process.env);

// Extend process.env with the parsed environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

try {
  env = EnvSchema.parse(process.env);
} catch (err) {
  const error = err as ZodError;
  console.error("❌ Invalid environment variables");
  console.error(error.flatten());
  process.exit(0);
}

export { env };
