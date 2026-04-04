const STORE_KEY = "__fortumEnergyDashboardDebugStore";
const ADAPTIVE_HISTORY_LIMIT = 160;

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

const sortPoints = (left, right) => {
  const leftNumeric = /^\d+$/.test(left.number);
  const rightNumeric = /^\d+$/.test(right.number);
  if (leftNumeric && rightNumeric) {
    return Number(left.number) - Number(right.number);
  }
  if (leftNumeric) {
    return -1;
  }
  if (rightNumeric) {
    return 1;
  }
  return left.number.localeCompare(right.number);
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
  const states = hass?.states;
  if (!states || typeof states !== "object") {
    return [];
  }
  const byNumber = new Map();
  Object.entries(states).forEach(([entityId, stateObj]) => {
    if (!entityId.startsWith("sensor.metering_point_")) {
      return;
    }
    const numberRaw = stateObj?.attributes?.metering_point_no;
    const number = typeof numberRaw === "string" ? numberRaw.trim() : "";
    if (!number) {
      return;
    }
    const addressRaw = stateObj?.attributes?.address;
    const address = typeof addressRaw === "string" ? addressRaw.trim() : "";
    const existing = byNumber.get(number);
    if (!existing) {
      byNumber.set(number, {
        number,
        address,
        label: address ? `${address} (${number})` : number,
        entity_ids: [entityId],
      });
      return;
    }
    if (!existing.address && address) {
      existing.address = address;
      existing.label = `${address} (${number})`;
    }
    if (!existing.entity_ids.includes(entityId)) {
      existing.entity_ids.push(entityId);
      existing.entity_ids.sort((a, b) => a.localeCompare(b));
    }
  });

  return Array.from(byNumber.values()).sort(sortPoints);
};

export const buildDashboardDebugExport = ({
  collectionKey,
  hass,
  adaptiveDebugInfo,
  adaptiveExportData,
}) => {
  const store = getStore();
  return {
    generated_at: new Date().toISOString(),
    format_version: 1,
    collection_key: collectionKey || "",
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
};
