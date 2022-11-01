import { stringifyJSON } from "../../src/utils/utils.ts";

Deno.bench("stringifyJSON", { group: "utils" }, () => {
  stringifyJSON({
    test: "data",
  });
});
