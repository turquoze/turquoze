import { Application } from "./deps.ts";
import { TurquozeState } from "./utils/types.ts";
import dbClient from "./clients/db.ts";
import redisClient from "./clients/redis.ts";
import Container from "./services/mod.ts";

const container = new Container(dbClient, redisClient);

const app = new Application<TurquozeState>();
app.state.container = container;

export default app;
