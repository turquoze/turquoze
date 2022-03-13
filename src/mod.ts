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

const PORT = 8080;
console.log(`Flywire is running on port: ${PORT}`);
await app.listen({ port: PORT });
