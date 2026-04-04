const normalizeMeteringPointNo = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "";
  }
  return "";
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

const resolveStates = (hassOrStates) => {
  if (hassOrStates?.states && typeof hassOrStates.states === "object") {
    return hassOrStates.states;
  }
  if (hassOrStates && typeof hassOrStates === "object") {
    return hassOrStates;
  }
  return null;
};

export const listDiscoverableMeteringPoints = (hassOrStates) => {
  const states = resolveStates(hassOrStates);
  if (!states) {
    return [];
  }

  const byNumber = new Map();
  Object.entries(states).forEach(([entityId, stateObj]) => {
    if (!entityId.startsWith("sensor.")) {
      return;
    }
    const number = normalizeMeteringPointNo(stateObj?.attributes?.metering_point_no);
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
        entityIds: [entityId],
      });
      return;
    }
    if (!existing.address && address) {
      existing.address = address;
      existing.label = `${address} (${number})`;
    }
    if (!existing.entityIds.includes(entityId)) {
      existing.entityIds.push(entityId);
      existing.entityIds.sort((left, right) => left.localeCompare(right));
    }
  });

  return Array.from(byNumber.values()).sort(sortPoints);
};

export const findMeteringPointStateByNumber = (hassOrStates, meteringPointNumber) => {
  const target = normalizeMeteringPointNo(meteringPointNumber);
  if (!target) {
    return null;
  }
  const states = resolveStates(hassOrStates);
  if (!states) {
    return null;
  }

  const matches = [];
  Object.entries(states).forEach(([entityId, stateObj]) => {
    if (!entityId.startsWith("sensor.")) {
      return;
    }
    const number = normalizeMeteringPointNo(stateObj?.attributes?.metering_point_no);
    if (number !== target) {
      return;
    }
    const addressRaw = stateObj?.attributes?.address;
    const hasAddress = typeof addressRaw === "string" && addressRaw.trim().length > 0;
    matches.push({ entityId, stateObj, hasAddress });
  });

  if (!matches.length) {
    return null;
  }

  matches.sort((left, right) => {
    if (left.hasAddress !== right.hasAddress) {
      return left.hasAddress ? -1 : 1;
    }
    return left.entityId.localeCompare(right.entityId);
  });

  return {
    entityId: matches[0].entityId,
    stateObj: matches[0].stateObj,
  };
};
