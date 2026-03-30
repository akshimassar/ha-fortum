export const localize = (hass, key, fallback) => hass.localize?.(key) || fallback;

export const computeAxisFractionDigits = (values, approxTicks = 6, maxDigits = 2) => {
  const finiteValues = (values || []).filter((value) => Number.isFinite(value));
  if (!finiteValues.length) {
    return 0;
  }

  const min = Math.min(...finiteValues);
  const max = Math.max(...finiteValues);
  const range = max - min;

  if (range <= 0) {
    return Math.abs(max) > 0 && Math.abs(max) < 1 ? maxDigits : 0;
  }

  const step = range / Math.max(1, approxTicks - 1);
  if (!Number.isFinite(step) || step <= 0) {
    return 0;
  }

  const digits = Math.ceil(-Math.log10(step));
  return Math.max(0, Math.min(maxDigits, digits));
};

export const formatForecastSeriesLabel = (statId, index) => {
  const match = /^fortum:price_forecast_([a-z0-9_]+)$/i.exec(statId || "");
  if (!match) {
    return index === 0 ? "Price" : `Price ${index + 1}`;
  }
  return `Price [${String(match[1] || "").toUpperCase()}]`;
};
