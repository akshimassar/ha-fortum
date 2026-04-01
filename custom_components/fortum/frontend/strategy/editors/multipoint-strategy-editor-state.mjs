import { normalizeItemizationRows } from "./single-strategy-editor-state.mjs";

const normalizeOptionalString = (value) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
};

const toPointState = (point) => ({
  number:
    typeof point?.number === "string" || typeof point?.number === "number"
      ? String(point.number).trim()
      : "",
  name: normalizeOptionalString(point?.name),
  itemizationRows: Array.isArray(point?.itemization)
    ? point.itemization.map((item) => ({
        stat: typeof item?.stat === "string" ? item.stat : "",
        name: typeof item?.name === "string" ? item.name : "",
      }))
    : [],
});

export const createMultipointEditorStateFromConfig = (config) => {
  const baseConfig = config && typeof config === "object" ? { ...config } : {};
  const points = Array.isArray(baseConfig.metering_points)
    ? baseConfig.metering_points.map(toPointState)
    : [];

  return {
    baseConfig,
    debug: baseConfig.debug === true,
    points: points.length ? points : [{ number: "", name: "", itemizationRows: [] }],
  };
};

export const buildMultipointConfigFromEditorState = (state) => {
  const config = {
    ...(state?.baseConfig && typeof state.baseConfig === "object" ? state.baseConfig : {}),
  };

  if (state?.debug === true) {
    config.debug = true;
  } else {
    delete config.debug;
  }

  delete config.itemization;

  const points = Array.isArray(state?.points) ? state.points : [];
  config.metering_points = points.map((point) => {
    const number =
      typeof point?.number === "string" || typeof point?.number === "number"
        ? String(point.number).trim()
        : "";
    const name = normalizeOptionalString(point?.name);

    return {
      number,
      ...(name ? { name } : {}),
      itemization: normalizeItemizationRows(point?.itemizationRows),
    };
  });

  return config;
};
