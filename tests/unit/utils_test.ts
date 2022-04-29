import { assert } from "../test_deps.ts";
import { stringifyJSON } from "../../src/utils/utils.ts";

Deno.test("stringifyJSON", async (t) => {
  await t.step({
    name: "json",
    fn: () => {
      const data = stringifyJSON({ t: 1 });
      assert(data != "");
    },
  });
});
