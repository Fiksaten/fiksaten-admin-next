import { defineConfig } from "@hey-api/openapi-ts";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default defineConfig({
  input: `${baseUrl}/swagger.json`,
  output: "app/lib/openapi-client",
  plugins: ["@hey-api/client-next"],
});
