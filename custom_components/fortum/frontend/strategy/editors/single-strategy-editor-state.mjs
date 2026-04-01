const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);

export const normalizeItemizationRows = (rows) =>
  (Array.isArray(rows) ? rows : [])
    .map((row) => {
      if (!row || typeof row !== "object") {
        return null;
      }
      const stat = typeof row.stat === "string" ? row.stat.trim() : "";
      if (!stat) {
        return null;
      }
      const name = typeof row.name === "string" ? row.name.trim() : "";
      return {
        stat,
        ...(name ? { name } : {}),
      };
    })
    .filter(Boolean);

export const createSingleEditorStateFromConfig = (config) => {
  const baseConfig = config && typeof config === "object" ? { ...config } : {};
  const meteringPoint =
    baseConfig.metering_point && typeof baseConfig.metering_point === "object"
      ? baseConfig.metering_point
      : {};
  const meteringPointNumber =
    typeof meteringPoint.number === "string" ? meteringPoint.number : "";
  const meteringPointName = typeof meteringPoint.name === "string" ? meteringPoint.name : "";
  const meteringPointTemperature =
    typeof meteringPoint.temperature === "string" ? meteringPoint.temperature : "";
  const debug = baseConfig.debug === true;
  const hasExplicitItemization = hasOwn(meteringPoint, "itemization");
  const itemizationRows = Array.isArray(meteringPoint.itemization)
    ? meteringPoint.itemization.map((item) => ({
        stat: typeof item?.stat === "string" ? item.stat : "",
        name: typeof item?.name === "string" ? item.name : "",
      }))
    : [];

  return {
    baseConfig,
    meteringPointNumber,
    meteringPointName,
    meteringPointTemperature,
    debug,
    hasExplicitItemization,
    itemizationRows,
  };
};

export const buildSingleConfigFromEditorState = (state) => {
  const config = {
    ...(state?.baseConfig && typeof state.baseConfig === "object" ? state.baseConfig : {}),
  };

  const meteringPoint =
    config.metering_point && typeof config.metering_point === "object"
      ? { ...config.metering_point }
      : {};

  const meteringPointNumber =
    typeof state?.meteringPointNumber === "string" ? state.meteringPointNumber.trim() : "";
  if (meteringPointNumber) {
    meteringPoint.number = meteringPointNumber;
  } else {
    delete meteringPoint.number;
  }

  const meteringPointName =
    typeof state?.meteringPointName === "string" ? state.meteringPointName.trim() : "";
  if (meteringPointName) {
    meteringPoint.name = meteringPointName;
  } else {
    delete meteringPoint.name;
  }

  const meteringPointTemperature =
    typeof state?.meteringPointTemperature === "string"
      ? state.meteringPointTemperature.trim()
      : "";
  if (meteringPointTemperature) {
    meteringPoint.temperature = meteringPointTemperature;
  } else {
    delete meteringPoint.temperature;
  }

  if (state?.debug === true) {
    config.debug = true;
  } else {
    delete config.debug;
  }

  if (state?.hasExplicitItemization) {
    meteringPoint.itemization = normalizeItemizationRows(state.itemizationRows);
  } else {
    delete meteringPoint.itemization;
  }

  delete config.itemization;
  delete config.fortum;

  if (Object.keys(meteringPoint).length > 0) {
    config.metering_point = meteringPoint;
  } else {
    delete config.metering_point;
  }

  return config;
};
