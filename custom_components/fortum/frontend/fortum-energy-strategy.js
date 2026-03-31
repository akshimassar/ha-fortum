import { FortumEnergyCustomLegendCard } from "/fortum-energy-static/strategy/cards/custom-legend-card.js";
import { FortumEnergyDevicesDetailOverlayCard } from "/fortum-energy-static/strategy/cards/devices-detail-overlay-card.js";
import { FortumEnergyDevicesAdaptiveGraphCard } from "/fortum-energy-static/strategy/cards/devices-adaptive-graph-card.js";
import { FortumEnergyFuturePriceCard } from "/fortum-energy-static/strategy/cards/future-price-card.js";
import { FortumEnergySettingsRedirectCard } from "/fortum-energy-static/strategy/cards/settings-redirect-card.js";
import { FortumEnergyQuickRangesCard } from "/fortum-energy-static/strategy/cards/quick-ranges-card.js";
import { FortumEnergySpacerCard } from "/fortum-energy-static/strategy/cards/spacer-card.js";
import { DEFAULT_COLLECTION_KEY, EMPTY_PREFS } from "/fortum-energy-static/strategy/shared/constants.js";
import { fetchEnergyPrefs } from "/fortum-energy-static/strategy/shared/energy-prefs.js";
import { localize } from "/fortum-energy-static/strategy/shared/formatters.js";

const isFortumConsumptionStatId = (statId) =>
  typeof statId === "string" && /^[^:]*fortum:hourly_consumption_/.test(statId);

const hasAnyEnergyPrefs = (prefs) =>
  prefs &&
  (prefs.device_consumption.length > 0 || prefs.energy_sources.length > 0);

const normalizeEnergySourceOverrides = (energySources) => {
  if (!Array.isArray(energySources)) {
    return [];
  }

  return energySources
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const statEnergyFrom =
        typeof entry.stat_energy_from === "string" ? entry.stat_energy_from.trim() : "";
      if (!statEnergyFrom) {
        return null;
      }
      const statCost = typeof entry.stat_cost === "string" ? entry.stat_cost.trim() : "";
      return {
        stat_energy_from: statEnergyFrom,
        stat_cost: statCost || undefined,
      };
    })
    .filter(Boolean);
};

const getGridImportFlows = (source) => {
  if (Array.isArray(source?.flow_from) && source.flow_from.length) {
    return source.flow_from;
  }
  return [source];
};

const getGridExportFlows = (source) => {
  if (Array.isArray(source?.flow_to) && source.flow_to.length) {
    return source.flow_to;
  }
  return [source];
};

const toFortumPriceStatId = (consumptionStatId) => {
  if (!isFortumConsumptionStatId(consumptionStatId)) {
    return null;
  }
  return consumptionStatId.replace("hourly_consumption_", "hourly_price_");
};

const toFortumTemperatureStatId = (consumptionStatId) => {
  if (!isFortumConsumptionStatId(consumptionStatId)) {
    return null;
  }
  return consumptionStatId.replace("hourly_consumption_", "hourly_temperature_");
};

const toFortumPriceForecastStatId = (priceStatId) => {
  if (typeof priceStatId !== "string" || !priceStatId.includes("hourly_price_")) {
    return null;
  }
  return null;
};

const deriveEnergyRuntimeConfig = ({
  prefs,
  info,
  overrides,
  strictOverride = false,
}) => {
  const safePrefs = prefs || EMPTY_PREFS;
  const safeInfo = info || { cost_sensors: {} };
  const normalizedOverrides = normalizeEnergySourceOverrides(overrides);
  const hasOverrideInput = Array.isArray(overrides);
  const useOverride = strictOverride ? hasOverrideInput : normalizedOverrides.length > 0;

  const flowIds = {
    fromGrid: [],
    toGrid: [],
    solar: [],
    fromBattery: [],
    toBattery: [],
  };
  const overlayIds = {
    importCost: [],
    exportCompensation: [],
    price: [],
    temperature: [],
  };
  const forecastIds = [];
  const issues = [];

  if (useOverride) {
    if (!normalizedOverrides.length) {
      issues.push("override_provided_but_no_valid_energy_sources");
    }
    normalizedOverrides.forEach((source) => {
      flowIds.fromGrid.push(source.stat_energy_from);
      const costId = source.stat_cost || safeInfo.cost_sensors[source.stat_energy_from];
      if (costId) {
        overlayIds.importCost.push(costId);
      }
      const priceId = toFortumPriceStatId(source.stat_energy_from);
      if (priceId) {
        overlayIds.price.push(priceId);
        const forecastId = toFortumPriceForecastStatId(priceId);
        if (forecastId) {
          forecastIds.push(forecastId);
        }
      }
      const temperatureId = toFortumTemperatureStatId(source.stat_energy_from);
      if (temperatureId) {
        overlayIds.temperature.push(temperatureId);
      }
    });
  }

  (safePrefs.energy_sources || []).forEach((source) => {
    if (source.type === "grid") {
      if (!useOverride) {
        getGridImportFlows(source).forEach((flow) => {
          if (!flow?.stat_energy_from) {
            return;
          }
          flowIds.fromGrid.push(flow.stat_energy_from);
          const costId = flow.stat_cost || safeInfo.cost_sensors[flow.stat_energy_from];
          if (costId) {
            overlayIds.importCost.push(costId);
          }
          const priceId = toFortumPriceStatId(flow.stat_energy_from);
          if (priceId) {
            overlayIds.price.push(priceId);
            const forecastId = toFortumPriceForecastStatId(priceId);
            if (forecastId) {
              forecastIds.push(forecastId);
            }
          }
          const temperatureId = toFortumTemperatureStatId(flow.stat_energy_from);
          if (temperatureId) {
            overlayIds.temperature.push(temperatureId);
          }
        });
      }

      getGridExportFlows(source).forEach((flow) => {
        if (!flow?.stat_energy_to) {
          return;
        }
        flowIds.toGrid.push(flow.stat_energy_to);
        const compensationId =
          flow.stat_compensation ||
          flow.stat_cost ||
          safeInfo.cost_sensors[flow.stat_energy_to];
        if (compensationId) {
          overlayIds.exportCompensation.push(compensationId);
        }
      });
      return;
    }

    if (source.type === "solar" && source.stat_energy_from) {
      flowIds.solar.push(source.stat_energy_from);
      return;
    }

    if (source.type === "battery") {
      if (source.stat_energy_from) {
        flowIds.fromBattery.push(source.stat_energy_from);
      }
      if (source.stat_energy_to) {
        flowIds.toBattery.push(source.stat_energy_to);
      }
    }
  });

  return {
    source: useOverride ? "override" : "prefs",
    strictOverride: !!strictOverride,
    hasOverrideInput,
    overridesCount: normalizedOverrides.length,
    issues,
    flowIds: {
      fromGrid: Array.from(new Set(flowIds.fromGrid)),
      toGrid: Array.from(new Set(flowIds.toGrid)),
      solar: Array.from(new Set(flowIds.solar)),
      fromBattery: Array.from(new Set(flowIds.fromBattery)),
      toBattery: Array.from(new Set(flowIds.toBattery)),
    },
    overlayIds: {
      importCost: Array.from(new Set(overlayIds.importCost)),
      exportCompensation: Array.from(new Set(overlayIds.exportCompensation)),
      price: Array.from(new Set(overlayIds.price)),
      temperature: Array.from(new Set(overlayIds.temperature)),
    },
    forecastIds: Array.from(new Set(forecastIds)),
  };
};

const buildSetupView = () => ({
  title: "Setup",
  path: "setup",
  cards: [
    {
      type: "markdown",
      content:
        "No Energy preferences found yet. Open **Settings -> Dashboards -> Energy** and complete setup first.",
    },
  ],
});

const buildSettingsView = (hass) => ({
  title: localize(hass, "ui.panel.config.energy.caption", "Settings"),
  path: "settings",
  icon: "mdi:cog",
  cards: [
    {
      type: "custom:fortum-energy-settings-redirect-card",
    },
  ],
});

const buildElectricityViewConfig = (
  prefs,
  collectionKey,
  hass,
  debug = false,
  energySources = []
) => {
  const view = {
    title: localize(hass, "ui.panel.energy.title.electricity", "Electricity"),
    path: "electricity",
    type: "sections",
    sections: [],
  };

  const mainCards = [];

  mainCards.push({
    type: "custom:fortum-energy-spacer-card",
    grid_options: { columns: 6 },
  });

  mainCards.push({
    title: localize(
      hass,
      "ui.panel.energy.cards.energy_date_selection_title",
      "Time range"
    ),
    type: "energy-date-selection",
    collection_key: collectionKey,
    disable_compare: true,
    opening_direction: "right",
    vertical_opening_direction: "down",
    grid_options: { columns: 12 },
  });

  mainCards.push({
    type: "custom:fortum-energy-quick-ranges-card",
    collection_key: collectionKey,
    grid_options: { columns: 12 },
  });

  mainCards.push({
    type: "custom:fortum-energy-spacer-card",
    grid_options: { columns: 6 },
  });

  if (prefs.device_consumption.length) {
    mainCards.push({
      type: "custom:fortum-energy-devices-adaptive-graph-card",
      collection_key: collectionKey,
      debug,
      energy_sources: energySources,
      grid_options: { columns: 36 },
    });

    mainCards.push({
      title: "Price of Tomorrow",
      type: "custom:fortum-energy-future-price-card",
      collection_key: collectionKey,
      debug,
      energy_sources: energySources,
      grid_options: { columns: 36 },
    });
  }

  mainCards.push({
    type: "custom:fortum-energy-spacer-card",
  });

  view.sections.push({
    type: "grid",
    column_span: 3,
    cards: mainCards,
  });

  return view;
};

class FortumEnergyDashboardStrategy extends HTMLElement {
  static async generate(config, hass) {
    try {
      const collectionKey =
        config.collection_key || config.collectionKey || DEFAULT_COLLECTION_KEY;
      const debug = config.debug === true;
      const energySources = normalizeEnergySourceOverrides(config.energy_sources);
      const prefs = await fetchEnergyPrefs(hass);

      if (!hasAnyEnergyPrefs(prefs)) {
        return { views: [buildSetupView(), buildSettingsView(hass)] };
      }

      return {
        views: [
          buildElectricityViewConfig(prefs, collectionKey, hass, debug, energySources),
          buildSettingsView(hass),
        ],
      };
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      return {
        views: [
          {
            title: "Error",
            path: "error",
            cards: [
              {
                type: "markdown",
                content: `Error loading fortum-energy strategy:\n> ${message}`,
              },
            ],
          },
        ],
      };
    }
  }

  static async generateDashboard(args) {
    return this.generate(args.strategy || {}, args.hass);
  }
}

const registerIfNeeded = (tag, klass) => {
  if (typeof customElements === "undefined") {
    return;
  }
  if (!customElements.get(tag)) {
    customElements.define(tag, klass);
  }
};

if (typeof process !== "undefined" && process?.versions?.node) {
  globalThis.__fortumEnergyStrategyTestHooks = {
    normalizeEnergySourceOverrides,
    deriveEnergyRuntimeConfig,
  };
}

registerIfNeeded(
  "fortum-energy-custom-legend-card",
  FortumEnergyCustomLegendCard
);
registerIfNeeded("fortum-energy-spacer-card", FortumEnergySpacerCard);
registerIfNeeded("fortum-energy-quick-ranges-card", FortumEnergyQuickRangesCard);
registerIfNeeded(
  "fortum-energy-devices-detail-overlay-card",
  FortumEnergyDevicesDetailOverlayCard
);
registerIfNeeded(
  "fortum-energy-devices-adaptive-graph-card",
  FortumEnergyDevicesAdaptiveGraphCard
);
registerIfNeeded("fortum-energy-future-price-card", FortumEnergyFuturePriceCard);
registerIfNeeded("fortum-energy-settings-redirect-card", FortumEnergySettingsRedirectCard);
try {
  registerIfNeeded("ll-strategy-dashboard-fortum-energy", FortumEnergyDashboardStrategy);
} catch (err) {
  console.error("[fortum-energy] strategy registration failed", err);
}
