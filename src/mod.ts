import App from "./app.ts";
import { stringifyJSON } from "./utils/utils.ts";
import dbClient from "./clients/db.ts";
import Container from "./services/mod.ts";

export const container = new Container(dbClient);
const app = new App(container);

await app.migrate();

if (import.meta.main) {
  Deno.serve({
    hostname: "127.0.0.1",
    port: 8080,
    onListen: ({ hostname, port }) => {
      console.log(`Listening on: http://${hostname}:${port}`);
    },
    onError: (error) => {
      console.log(`error: ${stringifyJSON(error)}`);
      return new Response("Server error", {
        status: 500,
      });
    },
  }, app.router().fetch);
}
