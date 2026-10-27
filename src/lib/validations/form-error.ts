import type { ZodError } from "zod";

export function zodErrorMessage(error: ZodError): string {
  return error.issues.map((issue) => issue.message).join(", ");
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}
