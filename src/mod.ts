import app from "./app.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";
import utils from "./routes/utils/utils.ts";
import ResponseTimer from "./middleware/responseTimer.ts";
import Logger from "./middleware/logger.ts";
import DBCloser from "./middleware/dbCloser.ts";
import { stringifyJSON } from "./utils/utils.ts";
import notFoundPage from "./pages/404.ts";

app.use(async (ctx, next) => {
  await next();
  ctx.response.headers.append("Access-Control-Allow-Origin", "*");
  ctx.response.headers.append(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  ctx.response.headers.append(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  ctx.response.headers.append(
    "Access-Control-Allow-Credentials",
    true.valueOf().toString(),
  );
});

app.use(DBCloser);
app.use(Logger);
app.use(ResponseTimer);

app.use(admin.routes());
app.use(api.routes());
app.use(utils.routes());

app.use((ctx) => {
  const hit = ctx.request.accepts()?.find((x) => x == "text/html");

  if (hit != undefined) {
    const html = notFoundPage;

    ctx.response.status = 404;
    ctx.response.headers.set("content-type", "text/html");
    ctx.response.body = html;
  } else {
    ctx.response.status = 404;
    ctx.response.headers.set("content-type", "application/json");
    ctx.response.body = JSON.stringify({
      msg: "Not Found",
      error: "NOT_FOUND",
    });
  }
});

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

app.addEventListener("error", (error) => {
  console.log(`error: ${stringifyJSON(error)}`);
});

await app.listen({ port: 8080, hostname: "127.0.0.1" });
