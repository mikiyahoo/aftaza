export function getDatabaseErrorMessage(error: unknown, fallback?: string) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback ?? "The application could not reach the configured database.";
}
