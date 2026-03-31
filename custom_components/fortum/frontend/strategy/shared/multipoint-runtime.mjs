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
  const entityId = `sensor.metering_point_${meteringPointNumber}`;
  const sensorState = hass?.states?.[entityId];
  if (!sensorState) {
    return {
      forecastIds: [],
      forecastError: `Metering point sensor ${entityId} is missing.`,
    };
  }

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

export const buildSingleConfigsFromMultipoint = (validatedConfig) =>
  (Array.isArray(validatedConfig?.metering_points) ? validatedConfig.metering_points : []).map(
    (point) => {
      const normalizedNumber = normalizeMeteringPointNumber(point.number);
      const singleConfig = {
        ...validatedConfig,
        fortum: {
          ...(validatedConfig?.fortum || {}),
        },
      };

      if (normalizedNumber) {
        singleConfig.fortum.metering_point_number = normalizedNumber;
      }
      singleConfig.itemization = point.itemization;
      singleConfig.electricity_title = point.name || point.address || point.number;
      return singleConfig;
    }
  );
