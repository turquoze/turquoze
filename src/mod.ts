import { Application } from "./deps.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";
import { TurquozeState } from "./utils/types.ts";
import ResponseTimer from "./middleware/responseTimer.ts";
import Logger from "./middleware/logger.ts";
import container from "./services/mod.ts";
import initPlugins from "./plugins/mod.ts";
import plugin from "./routes/api/plugin.ts";

initPlugins();

const app = new Application<TurquozeState>();

app.use(Logger);
app.use(ResponseTimer);

app.use(admin.routes());
app.use(api.routes());
app.use(new plugin(container).routes());

app.use((ctx) => {
  ctx.response.body = JSON.stringify({}), { status: 404 };
});

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

app.addEventListener("error", (error) => {
  console.log(`error: ${JSON.stringify(error)}`);
});

await app.listen({ port: 8080 });
