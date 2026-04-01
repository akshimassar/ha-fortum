const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);

export const ITEMIZATION_BACKUP_VERSION = 1;

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

const getBackupRoot = (fortumEditor) => {
  const backup = fortumEditor?.itemization_backup;
  if (!backup || typeof backup !== "object" || Array.isArray(backup)) {
    return undefined;
  }
  if (backup.v !== ITEMIZATION_BACKUP_VERSION) {
    return undefined;
  }
  return backup;
};

export const readSingleItemizationBackup = (fortumEditor) => {
  const backup = getBackupRoot(fortumEditor);
  if (!backup || !hasOwn(backup, "single")) {
    return undefined;
  }
  return normalizeItemizationRows(backup.single);
};

export const writeSingleItemizationBackup = (fortumEditor, rows) => {
  const normalizedRows = normalizeItemizationRows(rows);
  const current = getBackupRoot(fortumEditor);
  const next = {
    v: ITEMIZATION_BACKUP_VERSION,
    ...(current?.multipoint && typeof current.multipoint === "object"
      ? { multipoint: current.multipoint }
      : {}),
    single: normalizedRows,
  };
  return {
    ...(fortumEditor && typeof fortumEditor === "object" ? fortumEditor : {}),
    itemization_backup: next,
  };
};
