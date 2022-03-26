import { Application } from "./deps.ts";

import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";

import ResponseTimer from "./middleware/responseTimer.ts";
import { TurquozeState } from "./utils/types.ts";
import ApplicationState from "./middleware/applicationState.ts";

const app = new Application<TurquozeState>();

app.use(ResponseTimer);
app.use(ApplicationState);

app.use(admin.routes());
app.use(api.routes());

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});
await app.listen({ port: 8080 });
