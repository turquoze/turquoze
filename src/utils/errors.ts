import { yup } from "../deps.ts";
import { ErrorResponse } from "./types.ts";

export class DatabaseError extends Error {
  constructor(message: string, ...args: any) {
    super(message, ...args);
    this.message = message + " has not yet been implemented.";
  }
}

export function ErrorHandler(error: Error): ErrorResponse {
  if (error instanceof DatabaseError) {
    return {
      code: 500,
      message: "Error with your request on our side",
    };
  } else if (error instanceof yup.ValidationError) {
    return {
      code: 400,
      message: error.errors[0] ?? "Validation error",
    };
  } else {
    return {
      code: 400,
      message: "Error with your request",
    };
  }
}
