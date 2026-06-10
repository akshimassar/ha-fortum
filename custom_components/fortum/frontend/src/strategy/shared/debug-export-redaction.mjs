const REDACTED = "[REDACTED]";

const SENSITIVE_KEYS = new Set([
  "access_token",
  "refreshtoken",
  "refresh_token",
  "idtoken",
  "id_token",
  "token",
  "authorization",
  "cookie",
  "cookies",
  "set-cookie",
  "session",
  "session_data",
  "session_cookies",
  "password",
  "username",
  "customerid",
  "customer_id",
  "postaladdress",
  "postal_address",
  "postoffice",
  "post_office",
  "name",
  "address",
  "label",
  "entity_id",
  "entity_ids",
]);

const TOKEN_KEYS = new Set([
  "access_token",
  "refreshtoken",
  "refresh_token",
  "idtoken",
  "id_token",
  "token",
  "authorization",
  "cookie",
  "cookies",
  "set-cookie",
  "session",
  "session_data",
  "session_cookies",
  "password",
]);

const MESSAGE_REDACTION_PATTERNS = [
  [/\b(Bearer)\s+([^\s,;]+)/gi, "$1 [REDACTED]"],
  [
    /\b(authorization|access_token|refresh_token|id_token|token|password|cookie|set-cookie|csrftoken)\b\s*[:=]\s*(?:Bearer\s+)?([^\s,;]+)/gi,
    "$1=[REDACTED]",
  ],
  [
    /("(?:authorization|access_token|refresh_token|id_token|token|password|cookie|set-cookie|csrftoken)"\s*:\s*")([^"]+)(")/gi,
    "$1[REDACTED]$3",
  ],
];

const createRedactionContext = () => ({
  personalMap: new Map(),
  personalCounter: 0,
});

const isNumericString = (value) => typeof value === "string" && /^\d+$/.test(value.trim());

const toRedactionLabelKey = (key) => {
  const normalized = String(key || "value")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || "value";
};

const mapPersonalValue = (value, key, context) => {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    return "";
  }
  const existing = context.personalMap.get(text);
  if (existing) {
    return existing;
  }
  context.personalCounter += 1;
  const labelKey = toRedactionLabelKey(key);
  const masked = `[REDACTED ${labelKey} ${context.personalCounter}]`;
  context.personalMap.set(text, masked);
  return masked;
};

const redactMessageText = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  return MESSAGE_REDACTION_PATTERNS.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    value
  );
};

const sanitizeSensitiveScalar = (value, keyLower, context) => {
  if (typeof value !== "string") {
    return value;
  }
  if (TOKEN_KEYS.has(keyLower)) {
    return REDACTED;
  }
  if (keyLower === "number" || keyLower === "metering_point_no") {
    return isNumericString(value)
      ? value.trim()
      : mapPersonalValue(value, keyLower, context);
  }
  const labelKey = keyLower === "entity_ids" ? "entity_id" : keyLower;
  return mapPersonalValue(value, labelKey, context);
};

const sanitizeValue = (value, key, context) => {
  if (Array.isArray(value)) {
    const keyLower = typeof key === "string" ? key.toLowerCase() : "";
    if (keyLower === "entity_ids") {
      return value.map((item) =>
        typeof item === "string"
          ? mapPersonalValue(item, "entity_id", context)
          : sanitizeValue(item, "", context)
      );
    }
    return value.map((item) => sanitizeValue(item, key, context));
  }
  if (value && typeof value === "object") {
    const output = {};
    Object.entries(value).forEach(([childKey, childValue]) => {
      const keyLower = childKey.toLowerCase();
      if (SENSITIVE_KEYS.has(keyLower)) {
        if (Array.isArray(childValue)) {
          output[childKey] = childValue.map((item) =>
            sanitizeSensitiveScalar(item, keyLower, context)
          );
        } else if (childValue && typeof childValue === "object") {
          output[childKey] = sanitizeValue(childValue, childKey, context);
        } else {
          output[childKey] = sanitizeSensitiveScalar(childValue, keyLower, context);
        }
        return;
      }
      if (
        (keyLower === "number" || keyLower === "metering_point_no") &&
        typeof childValue === "string"
      ) {
        output[childKey] = isNumericString(childValue)
          ? childValue.trim()
          : mapPersonalValue(childValue, keyLower, context);
        return;
      }
      output[childKey] = sanitizeValue(childValue, childKey, context);
    });
    return output;
  }
  if (typeof value === "string") {
    return redactMessageText(value);
  }
  return value;
};

export const sanitizeDiagnosticsPayload = (payload) => {
  const context = createRedactionContext();
  return sanitizeValue(payload, "", context);
};

export const REDACTION_TOKEN = REDACTED;
