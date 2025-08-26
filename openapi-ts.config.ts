import { defineConfig } from "@hey-api/openapi-ts";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = "https://fiksaten-api-v2.onrender.com";

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

export default defineConfig({
  input: `${baseUrl}/swagger.json`,
  output: "app/lib/openapi-client",
  plugins: ["@hey-api/client-next"],
});
