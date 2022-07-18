import { Application } from "./deps.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";
import { TurquozeState } from "./utils/types.ts";
import ResponseTimer from "./middleware/responseTimer.ts";
import ApplicationState from "./middleware/applicationState.ts";
import Logger from "./middleware/logger.ts";
import AuthGuard from "./middleware/authGuard.ts";
import container from "./services/mod.ts";

const app = new Application<TurquozeState>();

app.use(Logger);
app.use(ResponseTimer);
app.use(AuthGuard(container.TokenService));
app.use(ApplicationState(container.ShopService));

app.use(admin.routes());
app.use(api.routes());

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

app.addEventListener("error", (error) => {
  console.log(`error: ${error}`);
});

await app.listen({ port: 8080 });
