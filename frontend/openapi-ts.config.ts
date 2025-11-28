import { defineConfig } from "@hey-api/openapi-ts";
import { config } from "dotenv";

config();

export default defineConfig({
  input: `${process.env.DEVELOPMENT_API_URL}/docs-json`,
  output: "generated/openapi-client",
  plugins: [
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "./config/openapi-runtime",
    },
  ],
});
