import { flatten, ValiError } from "../deps.ts";
import { ErrorResponse } from "./types.ts";

export class DatabaseError extends Error {
  // deno-lint-ignore no-explicit-any
  constructor(message: string, ...args: any) {
    super(message, ...args);
    this.message = message;
  }
}

export class NoBodyError extends Error {
  // deno-lint-ignore no-explicit-any
  constructor(message: string, ...args: any) {
    super(message, ...args);
    this.message = message;
  }
}

export class NoCartError extends Error {
  // deno-lint-ignore no-explicit-any
  constructor(message: string, ...args: any) {
    super(message, ...args);
    this.message = message;
  }
}

export function ErrorHandler(error: Error): ErrorResponse {
  console.error(error);
  if (error instanceof DatabaseError) {
    return {
      code: 500,
      message: "Error with your request on our side",
    };
  } else if (error instanceof ValiError) {
    //@ts-expect-error not on type
    const errors = flatten(error);
    return {
      code: 400,
      message: JSON.stringify(errors) ?? "Validation error",
    };
  } else if (error instanceof NoBodyError) {
    return {
      code: 400,
      message: "No body content sent",
    };
  } else if (error instanceof NoCartError) {
    return {
      code: 404,
      message: "No cart found",
    };
  } else {
    return {
      code: 400,
      message: "Error with your request",
    };
  }
}
