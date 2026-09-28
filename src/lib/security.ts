/**
 * DevTech Security Utility Helper
 * Provides input sanitization against NoSQL injection, XSS attacks, and payload validation.
 */

/**
 * Sanitizes a string input to prevent NoSQL injection by ensuring it is purely a string,
 * removing any MongoDB operator prefixes (like $gt, $ne, $where, $expr).
 */
export function sanitizeString(input: unknown, defaultValue: string = ""): string {
  if (typeof input !== "string") {
    if (typeof input === "number" || typeof input === "boolean") {
      return String(input);
    }
    return defaultValue;
  }
  
  // Remove dangerous MongoDB query operator characters at start of string or nested keys
  const cleaned = input.replace(/\$+[a-zA-Z0-9_]*/g, "").trim();
  return cleaned;
}

/**
 * Sanitizes user HTML/Text content to prevent Cross-Site Scripting (XSS).
 * Strips script tags, iframe, onload, and dangerous event handlers.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

/**
 * Validates that an object key/filter is safe for MongoDB queries.
 */
export function sanitizeMongoFilter<T extends Record<string, any>>(obj: T): Partial<T> {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return {};
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    // Ignore any top-level key starting with $ (e.g. $where, $gt)
    if (key.startsWith("$")) continue;

    if (typeof val === "string") {
      cleanObj[key] = sanitizeString(val);
    } else if (typeof val === "number" || typeof val === "boolean") {
      cleanObj[key] = val;
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      cleanObj[key] = sanitizeMongoFilter(val);
    } else {
      cleanObj[key] = val;
    }
  }
  return cleanObj as Partial<T>;
}
