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
  const fortum =
    baseConfig.fortum && typeof baseConfig.fortum === "object" ? baseConfig.fortum : {};
  const meteringPointNumber =
    typeof fortum.metering_point_number === "string" ? fortum.metering_point_number : "";
  const debug = baseConfig.debug === true;
  const hasExplicitItemization = hasOwn(baseConfig, "itemization");
  const itemizationRows = Array.isArray(baseConfig.itemization)
    ? baseConfig.itemization.map((item) => ({
        stat: typeof item?.stat === "string" ? item.stat : "",
        name: typeof item?.name === "string" ? item.name : "",
      }))
    : [];

  return {
    baseConfig,
    meteringPointNumber,
    debug,
    hasExplicitItemization,
    itemizationRows,
  };
};

export const buildSingleConfigFromEditorState = (state) => {
  const config = {
    ...(state?.baseConfig && typeof state.baseConfig === "object" ? state.baseConfig : {}),
  };

  const fortum =
    config.fortum && typeof config.fortum === "object" ? { ...config.fortum } : {};

  const meteringPointNumber =
    typeof state?.meteringPointNumber === "string" ? state.meteringPointNumber.trim() : "";
  if (meteringPointNumber) {
    fortum.metering_point_number = meteringPointNumber;
  } else {
    delete fortum.metering_point_number;
  }

  if (Object.keys(fortum).length > 0) {
    config.fortum = fortum;
  } else {
    delete config.fortum;
  }

  if (state?.debug === true) {
    config.debug = true;
  } else {
    delete config.debug;
  }

  if (state?.hasExplicitItemization) {
    config.itemization = normalizeItemizationRows(state.itemizationRows);
  } else {
    delete config.itemization;
  }

  return config;
};
