import { defineConfig } from "orval";

export default defineConfig({
  respace: {
    input: "./openapi.json",
    output: {
      mode: "tags-split",
      target: "./src/shared/api/generated/endpoints.ts",
      schemas: "./src/shared/api/generated/model",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      override: {
        mutator: {
          path: "./src/shared/api/fetcher.ts",
          name: "fetcher",
        },
      },
    },
  },
});
