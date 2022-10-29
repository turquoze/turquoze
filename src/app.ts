import { Application } from "./deps.ts";
import { TurquozeState } from "./utils/types.ts";
import container from "./services/mod.ts";

const app = new Application<TurquozeState>();
app.state.container = container;

export default app;
