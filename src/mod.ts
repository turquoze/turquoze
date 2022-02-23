import { Application } from "./deps.ts";

import admin from "./routes/admin/admin.ts";
import api from "./routes/api/api.ts";

import ResponseTimer from "./middleware/responseTimer.ts";

const app = new Application();

app.use(ResponseTimer);

app.use(admin.routes());
app.use(api.routes());

const PORT = 8080;
console.log(`Flywire is running on port: ${PORT}`);
await app.listen({ port: PORT });
