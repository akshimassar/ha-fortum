import { findMeteringPointStateByNumber } from "./metering-point-discovery.mjs";

export const normalizeMeteringPointNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  return null;
};

export const toStatisticIdSet = (rawItems) =>
  new Set(
    (Array.isArray(rawItems) ? rawItems : [])
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        return item?.statistic_id;
      })
      .filter((value) => typeof value === "string" && value.length)
  );

export const resolvePointForecast = (hass, meteringPointNumber, statisticIds) => {
  const resolved = findMeteringPointStateByNumber(hass, meteringPointNumber);
  if (!resolved) {
    return {
      forecastIds: [],
      forecastError: `Metering point sensor with metering_point_no=${meteringPointNumber} is missing.`,
    };
  }
  const entityId = resolved.entityId;
  const sensorState = resolved.stateObj;

  const priceArea = sensorState?.attributes?.price_area;
  if (typeof priceArea !== "string" || !priceArea.trim()) {
    return {
      forecastIds: [],
      forecastError: `Sensor ${entityId} has no attribute price_area.`,
    };
  }

  const statisticId = `fortum:price_forecast_${priceArea.trim().toLowerCase()}`;
  if (!statisticIds.has(statisticId)) {
    return {
      forecastIds: [],
      forecastError: `Price statistic ${statisticId} has no values.`,
    };
  }

  return {
    forecastIds: [statisticId],
    forecastError: null,
  };
};

export const applyForecastConfigToView = (view, forecastIds, forecastError) => {
  if (!view || !Array.isArray(view.sections)) {
    return view;
  }

  view.sections.forEach((section) => {
    if (!Array.isArray(section?.cards)) {
      return;
    }
    section.cards.forEach((card) => {
      if (card?.type !== "custom:fortum-energy-future-price-card") {
        return;
      }
      const resolvedMetrics = card.resolved_metrics || {};
      card.resolved_metrics = {
        ...resolvedMetrics,
        price_forecast: forecastIds,
        future_price_error: forecastError,
      };
    });
  });

  return view;
};

export const buildSingleConfigsFromMultipoint = (validatedConfig, hass) =>
  (Array.isArray(validatedConfig?.metering_points) ? validatedConfig.metering_points : []).map(
    (point) => {
      const normalizedNumber = normalizeMeteringPointNumber(point.number);
      const resolvedPoint = normalizedNumber
        ? findMeteringPointStateByNumber(hass, normalizedNumber)
        : null;
      const sensorAddress = resolvedPoint?.stateObj?.attributes?.address;
      const fallbackAddress =
        typeof sensorAddress === "string" && sensorAddress.trim()
          ? sensorAddress.trim()
          : undefined;
      const singleConfig = {
        ...validatedConfig,
        metering_point: {
          ...(validatedConfig?.metering_point || {}),
        },
      };

      delete singleConfig.metering_points;
      if (normalizedNumber) {
        singleConfig.metering_point.number = normalizedNumber;
      }
      singleConfig.metering_point.itemization = point.itemization;
      if (point.name) {
        singleConfig.metering_point.name = point.name;
      } else {
        delete singleConfig.metering_point.name;
      }
      if (typeof point.temperature === "string" && point.temperature.trim()) {
        singleConfig.metering_point.temperature = point.temperature.trim();
      } else {
        delete singleConfig.metering_point.temperature;
      }
      singleConfig.electricity_title = point.name || fallbackAddress || point.number;
      return singleConfig;
    }
  );
