import { assertObjectMatch } from "../test_deps.ts";
import { DatabaseError, ErrorHandler } from "../../src/utils/errors.ts";

Deno.test("ErrorHandler", async (t) => {
  await t.step({
    name: "Error",
    fn: () => {
      const data = ErrorHandler(new Error("TEST"));
      assertObjectMatch(data, {
        code: 400,
        message: "Error with your request",
      });
    },
  });

  await t.step({
    name: "DatabaseError",
    fn: () => {
      const data = ErrorHandler(new DatabaseError("TEST"));
      assertObjectMatch(data, {
        code: 500,
        message: "Error with your request on our side",
      });
    },
  });
});
