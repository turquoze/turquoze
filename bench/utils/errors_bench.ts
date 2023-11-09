import {
  DatabaseError,
  ErrorHandler,
  NoBodyError,
  NoCartError,
} from "../../src/utils/errors.ts";

Deno.bench("DatabaseError", { group: "errors" }, () => {
  new DatabaseError("test db error");
});

Deno.bench("NoBodyError", { group: "errors" }, () => {
  new NoBodyError("test no body error");
});

Deno.bench("NoCartError", { group: "errors" }, () => {
  new NoCartError("test cart error");
});

Deno.bench("ErrorHandler - DatabaseError", { group: "errors" }, () => {
  ErrorHandler(new DatabaseError("test db error"));
});

Deno.bench("ErrorHandler - NoBodyError", { group: "errors" }, () => {
  ErrorHandler(new NoBodyError("test db error"));
});

Deno.bench("ErrorHandler - NoCartError", { group: "errors" }, () => {
  ErrorHandler(new NoBodyError("test db error"));
});

Deno.bench("ErrorHandler - Error", { group: "errors" }, () => {
  ErrorHandler(new Error("test error"));
});
