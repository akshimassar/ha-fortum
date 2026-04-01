import {
  normalizeItemizationRows,
  readSingleItemizationBackup,
  writeSingleItemizationBackup,
} from "../shared/itemization-backup.mjs";

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);

export { normalizeItemizationRows };

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
  const itemizationBackupRows =
    readSingleItemizationBackup(fortum?.editor) ??
    (hasExplicitItemization ? normalizeItemizationRows(baseConfig.itemization) : undefined);

  return {
    baseConfig,
    meteringPointNumber,
    debug,
    hasExplicitItemization,
    itemizationRows,
    itemizationBackupRows,
  };
};

export const buildSingleConfigFromEditorState = (state) => {
  const config = {
    ...(state?.baseConfig && typeof state.baseConfig === "object" ? state.baseConfig : {}),
  };

  const fortum =
    config.fortum && typeof config.fortum === "object" ? { ...config.fortum } : {};
  const fortumEditor = fortum.editor && typeof fortum.editor === "object" ? fortum.editor : {};

  const meteringPointNumber =
    typeof state?.meteringPointNumber === "string" ? state.meteringPointNumber.trim() : "";
  if (meteringPointNumber) {
    fortum.metering_point_number = meteringPointNumber;
  } else {
    delete fortum.metering_point_number;
  }

  if (state?.debug === true) {
    config.debug = true;
  } else {
    delete config.debug;
  }

  let itemizationBackupRows =
    Array.isArray(state?.itemizationBackupRows) || state?.itemizationBackupRows === null
      ? normalizeItemizationRows(state.itemizationBackupRows)
      : undefined;

  if (state?.hasExplicitItemization) {
    const itemizationRows = normalizeItemizationRows(state.itemizationRows);
    config.itemization = itemizationRows;
    itemizationBackupRows = itemizationRows;
  } else {
    delete config.itemization;
  }

  fortum.editor =
    itemizationBackupRows !== undefined
      ? writeSingleItemizationBackup(fortumEditor, itemizationBackupRows)
      : { ...fortumEditor };

  if (Object.keys(fortum.editor).length === 0) {
    delete fortum.editor;
  }

  if (Object.keys(fortum).length > 0) {
    config.fortum = fortum;
  } else {
    delete config.fortum;
  }

  return config;
};
