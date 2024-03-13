import App from "../src/app.ts";
import { stringifyJSON } from "../src/utils/utils.ts";

const app = new App(Deno.env.get("DATABASE_URL")!, {
  sharedSecret: Deno.env.get("SHARED_SECRET")!,
});

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
