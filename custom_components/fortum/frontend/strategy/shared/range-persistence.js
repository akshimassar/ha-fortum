import { RANGE_STORAGE_PREFIX } from "/fortum-energy-static/strategy/shared/constants.js";

const _samePeriod = (startA, endA, startB, endB) => {
  const aStart = startA instanceof Date ? startA.getTime() : null;
  const bStart = startB instanceof Date ? startB.getTime() : null;
  const aEnd = endA instanceof Date ? endA.getTime() : null;
  const bEnd = endB instanceof Date ? endB.getTime() : null;
  return aStart === bStart && aEnd === bEnd;
};

const _getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const _readStoredRange = (collectionKey) => {
  try {
    const raw = localStorage.getItem(`${RANGE_STORAGE_PREFIX}${collectionKey}`);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const startMs = Number(parsed?.start);
    const endMs = Number(parsed?.end);
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
      return null;
    }
    return { start: new Date(startMs), end: new Date(endMs) };
  } catch (_err) {
    return null;
  }
};

const _storeRange = (collectionKey, start, end) => {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    return;
  }
  localStorage.setItem(
    `${RANGE_STORAGE_PREFIX}${collectionKey}`,
    JSON.stringify({
      start: start.getTime(),
      end: end.getTime(),
    })
  );
};

export const ensureFortumEnergyRangePersistence = (hass, collectionKey) => {
  const collection = hass?.connection?.[`_${collectionKey}`];
  if (!collection || typeof collection.setPeriod !== "function") {
    return;
  }

  if (!collection.__myEnergyRangePatched) {
    const originalSetPeriod = collection.setPeriod.bind(collection);
    collection.setPeriod = (start, end) => {
      originalSetPeriod(start, end);
      if (start instanceof Date && end instanceof Date) {
        _storeRange(collectionKey, start, end);
      }
    };
    collection.__myEnergyRangePatched = true;
  }

  if (collection.__myEnergyRangeInitialized) {
    return;
  }
  collection.__myEnergyRangeInitialized = true;

  const stored = _readStoredRange(collectionKey);
  const range = stored || _getTodayRange();
  if (_samePeriod(collection.start, collection.end, range.start, range.end)) {
    return;
  }

  collection.setPeriod(range.start, range.end);
  if (typeof collection.refresh === "function") {
    collection.refresh();
  }
};
