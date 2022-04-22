import { Application } from "./deps.ts";
import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";
import { TurquozeState } from "./utils/types.ts";
import ResponseTimer from "./middleware/responseTimer.ts";
import ApplicationState from "./middleware/applicationState.ts";
import Logger from "./middleware/logger.ts";
import AuthGuard from "./middleware/authGuard.ts";

const app = new Application<TurquozeState>();

app.use(AuthGuard);
app.use(Logger);
app.use(ResponseTimer);
app.use(ApplicationState);

app.use(admin.routes());
app.use(api.routes());

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

app.addEventListener("error", (error) => {
  console.log(`error: ${error}`);
});

await app.listen({ port: 8080 });
