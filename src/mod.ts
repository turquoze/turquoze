import { Application } from "./deps.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";

const app = new Application();

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(admin.routes());
app.use(api.routes());

const PORT = 8080;
console.log(`Flywire is running on port: ${PORT}`);
await app.listen({ port: PORT });
