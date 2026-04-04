import { listDiscoverableMeteringPoints } from "/fortum-energy-static/strategy/shared/metering-point-discovery.mjs";

const STORE_KEY = "__fortumEnergyDashboardDebugStore";
const ADAPTIVE_HISTORY_LIMIT = 160;
const REDACTED = "[REDACTED]";
const PERSONAL_PREFIX = "PERSONAL_";

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

const clonePayload = (value) => {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch (_err) {
      // Fall back to JSON clone below.
    }
  }
  return JSON.parse(JSON.stringify(value));
};

const getStore = () => {
  if (!globalThis[STORE_KEY]) {
    globalThis[STORE_KEY] = {
      adaptiveHistory: [],
      latestAdaptive: null,
      latestFuturePrice: null,
      cardConfigs: {},
      sequence: 0,
    };
  }
  return globalThis[STORE_KEY];
};

const createRedactionContext = () => ({
  personalMap: new Map(),
  personalCounter: 0,
});

const isNumericString = (value) => typeof value === "string" && /^\d+$/.test(value.trim());

const mapPersonalValue = (value, context) => {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    return "";
  }
  const existing = context.personalMap.get(text);
  if (existing) {
    return existing;
  }
  context.personalCounter += 1;
  const masked = `${PERSONAL_PREFIX}${context.personalCounter}`;
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
    return isNumericString(value) ? value.trim() : mapPersonalValue(value, context);
  }
  return mapPersonalValue(value, context);
};

const sanitizeValue = (value, key, context) => {
  if (Array.isArray(value)) {
    const keyLower = typeof key === "string" ? key.toLowerCase() : "";
    if (keyLower === "entity_ids") {
      return value.map((item) =>
        typeof item === "string" ? mapPersonalValue(item, context) : sanitizeValue(item, "", context)
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
          output[childKey] = childValue.map((item) => sanitizeSensitiveScalar(item, keyLower, context));
        } else if (childValue && typeof childValue === "object") {
          output[childKey] = sanitizeValue(childValue, childKey, context);
        } else {
          output[childKey] = sanitizeSensitiveScalar(childValue, keyLower, context);
        }
        return;
      }
      if ((keyLower === "number" || keyLower === "metering_point_no") && typeof childValue === "string") {
        output[childKey] = isNumericString(childValue)
          ? childValue.trim()
          : mapPersonalValue(childValue, context);
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

const sanitizeDiagnosticsPayload = (payload) => {
  const context = createRedactionContext();
  return sanitizeValue(payload, "", context);
};

export const setDashboardCardConfig = (cardId, config) => {
  if (typeof cardId !== "string" || !cardId.length) {
    return;
  }
  const store = getStore();
  store.cardConfigs[cardId] = clonePayload(config || {});
};

export const recordAdaptiveDebugInfo = (payload) => {
  if (!payload || typeof payload !== "object") {
    return;
  }
  const store = getStore();
  store.sequence += 1;
  const row = {
    sequence: store.sequence,
    recorded_at: new Date().toISOString(),
    ...clonePayload(payload),
  };
  store.latestAdaptive = row;
  store.adaptiveHistory.push(row);
  if (store.adaptiveHistory.length > ADAPTIVE_HISTORY_LIMIT) {
    store.adaptiveHistory.splice(0, store.adaptiveHistory.length - ADAPTIVE_HISTORY_LIMIT);
  }
};

export const setLatestFuturePriceDebugInfo = (payload) => {
  if (!payload || typeof payload !== "object") {
    return;
  }
  const store = getStore();
  store.sequence += 1;
  store.latestFuturePrice = {
    sequence: store.sequence,
    recorded_at: new Date().toISOString(),
    ...clonePayload(payload),
  };
};

export const getDiscoverableMeteringPoints = (hass) => {
  return listDiscoverableMeteringPoints(hass).map((point) => ({
    number: point.number,
    address: point.address,
    label: point.label,
    entity_ids: point.entityIds,
  }));
};

export const buildDashboardDebugExport = ({
  collectionKey,
  hass,
  adaptiveDebugInfo,
  adaptiveExportData,
}) => {
  const store = getStore();
  const rawPayload = {
    generated_at: new Date().toISOString(),
    format_version: 2,
    collection_key: collectionKey || "",
    redaction: {
      enabled: true,
      personal_placeholder_prefix: PERSONAL_PREFIX,
      token_placeholder: REDACTED,
    },
    dashboard_config: clonePayload(store.cardConfigs),
    discoverable_metering_points: getDiscoverableMeteringPoints(hass),
    adaptive_graph: {
      latest_debug: adaptiveDebugInfo || store.latestAdaptive,
      latest_export_data: adaptiveExportData ? clonePayload(adaptiveExportData) : null,
      history: clonePayload(store.adaptiveHistory),
    },
    future_price: {
      latest_debug: clonePayload(store.latestFuturePrice),
    },
  };
  return sanitizeDiagnosticsPayload(rawPayload);
};
