import app from "./app.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";
import plugin from "./routes/plugin/mod.ts";
import ResponseTimer from "./middleware/responseTimer.ts";
import Logger from "./middleware/logger.ts";
import initPlugins from "./plugins/mod.ts";
import addEvents from "./utils/events.ts";
import DBCloser from "./middleware/dbCloser.ts";
import { stringifyJSON } from "./utils/utils.ts";

initPlugins();
addEvents();

app.use(DBCloser);
app.use(Logger);
app.use(ResponseTimer);

app.use(admin.routes());
app.use(api.routes());
app.use(plugin.routes());

app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.headers.set("content-type", "application/json");
  ctx.response.body = JSON.stringify({
    msg: "Not Found",
    error: "NOT_FOUND",
  });
});

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

app.addEventListener("error", (error) => {
  console.log(`error: ${stringifyJSON(error)}`);
});

await app.listen({ port: 8080, hostname: "127.0.0.1" });
