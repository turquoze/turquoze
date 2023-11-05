import { Application } from "@oakserver/oak";
import { TurquozeState } from "./utils/types.ts";
import dbClient from "./clients/db.ts";
import redisClient from "./clients/redis.ts";
import Container from "./services/mod.ts";
import addEvents from "./utils/events.ts";

const container = new Container(dbClient, redisClient);

addEvents(container);

const app = new Application<TurquozeState>();
app.state.container = container;

export default app;
