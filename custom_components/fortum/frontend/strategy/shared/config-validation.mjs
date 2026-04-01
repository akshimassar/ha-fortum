const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const SINGLE_EXAMPLE = `Valid single strategy example:\n\n\`\`\`yaml\ntype: custom:fortum-energy-single\nmetering_point:\n  number: "6094111"\n  name: Home\n  itemization:\n    - stat: sensor.sauna_energy\n      name: Sauna\n\`\`\``;

const MULTIPOINT_EXAMPLE = `Valid multipoint strategy example:\n\n\`\`\`yaml\ntype: custom:fortum-energy-multipoint\nmetering_points:\n  - number: "6094111"\n    name: Home\n    itemization:\n      - stat: sensor.sauna_energy\n        name: Sauna\n\`\`\``;

const formatValidationError = (message, strategyType) => {
  const example = strategyType === "multipoint" ? MULTIPOINT_EXAMPLE : SINGLE_EXAMPLE;
  return `${message}\n\n${example}`;
};

const normalizeRequiredString = (value, path) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  if (typeof value !== "string") {
    throw new Error(path + " must be a string.");
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(path + " must be a non-empty string.");
  }
  return trimmed;
};

const normalizeOptionalString = (value, path) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error(path + " must be a string when provided.");
  }
  const trimmed = value.trim();
  return trimmed || undefined;
};

const normalizeItemization = (itemization, path) => {
  if (!Array.isArray(itemization)) {
    throw new Error(path + " must be a list.");
  }
  return itemization.map((entry, index) => {
    if (!isObject(entry)) {
      throw new Error(`${path}[${index}] must be an object.`);
    }
    const statConsumption = normalizeRequiredString(
      entry.stat,
      `${path}[${index}].stat`
    );
    const name = normalizeOptionalString(entry.name, `${path}[${index}].name`);
    return {
      stat: statConsumption,
      ...(name ? { name } : {}),
    };
  });
};

const validateSingleStrategyConfigCore = (config) => {
  if (!isObject(config)) {
    throw new Error("strategy config must be an object.");
  }

  const validated = { ...config };
  if (Object.prototype.hasOwnProperty.call(validated, "debug")) {
    if (typeof validated.debug !== "boolean") {
      throw new Error("strategy.debug must be a boolean when provided.");
    }
  }

  if (validated.metering_point !== undefined) {
    if (!isObject(validated.metering_point)) {
      throw new Error("strategy.metering_point must be an object when provided.");
    }
    const meteringPoint = { ...validated.metering_point };
    if (meteringPoint.number !== undefined) {
      meteringPoint.number = normalizeRequiredString(meteringPoint.number, "strategy.metering_point.number");
    }
    const name = normalizeOptionalString(meteringPoint.name, "strategy.metering_point.name");
    if (name) {
      meteringPoint.name = name;
    } else {
      delete meteringPoint.name;
    }
    if (Object.prototype.hasOwnProperty.call(meteringPoint, "itemization")) {
      meteringPoint.itemization = normalizeItemization(
        meteringPoint.itemization,
        "strategy.metering_point.itemization"
      );
    }
    validated.metering_point = meteringPoint;
  }

  return validated;
};

export const validateSingleStrategyConfig = (config) => {
  try {
    return validateSingleStrategyConfigCore(config);
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    throw new Error(formatValidationError(message, "single"));
  }
};

export const validateMultipointStrategyConfig = (config) => {
  try {
    const validated = validateSingleStrategyConfigCore(config);
    if (!Array.isArray(validated.metering_points) || validated.metering_points.length === 0) {
      throw new Error("strategy.metering_points must be a non-empty list.");
    }

    validated.metering_points = validated.metering_points.map((point, index) => {
      if (!isObject(point)) {
        throw new Error(`strategy.metering_points[${index}] must be an object.`);
      }
      const number = normalizeRequiredString(
        point.number,
        `strategy.metering_points[${index}].number`
      );
      const name = normalizeOptionalString(
        point.name,
        `strategy.metering_points[${index}].name`
      );
      if (!Object.prototype.hasOwnProperty.call(point, "itemization")) {
        throw new Error(`strategy.metering_points[${index}].itemization must be a list.`);
      }

      return {
        number,
        ...(name ? { name } : {}),
        itemization: normalizeItemization(
          point.itemization,
          `strategy.metering_points[${index}].itemization`
        ),
      };
    });

    return validated;
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    throw new Error(formatValidationError(message, "multipoint"));
  }
};
