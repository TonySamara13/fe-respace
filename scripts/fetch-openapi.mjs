const url = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL.replace(/\/$/, "")}/v3/api-docs`
  : "http://localhost:8080/v3/api-docs";

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Не удалось скачать OpenAPI: ${response.status} ${url}`);
}

const spec = await response.text();
await import("node:fs/promises").then((fs) => fs.writeFile(new URL("../openapi.json", import.meta.url), spec));
console.log(`Сохранено openapi.json из ${url}`);
