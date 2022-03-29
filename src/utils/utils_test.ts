import { assert } from "../deps.ts";
import { stringifyJSON } from "./utils.ts";

Deno.test("stringifyJSON", async (t) => {
  await t.step({
    name: "json",
    fn: () => {
      const data = stringifyJSON({ t: 1 });
      assert(data != "");
    },
  });
});
