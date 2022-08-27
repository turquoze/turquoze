import { Application } from "./deps.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";
import plugin from "./routes/plugin/mod.ts";
import { TurquozeState } from "./utils/types.ts";
import ResponseTimer from "./middleware/responseTimer.ts";
import Logger from "./middleware/logger.ts";
import initPlugins from "./plugins/mod.ts";

initPlugins();

const app = new Application<TurquozeState>();

app.use(Logger);
app.use(ResponseTimer);

app.use(admin.routes());
app.use(api.routes());
app.use(plugin.routes());

app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = JSON.stringify({ status: 404 });
});

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

app.addEventListener("error", (error) => {
  console.log(`error: ${JSON.stringify(error)}`);
});

await app.listen({ port: 8080 });
