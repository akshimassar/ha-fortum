import { FortumEnergyCustomLegendCard } from "./strategy/cards/custom-legend-card.js";
import { FortumEnergyDevicesDetailOverlayCard } from "./strategy/cards/devices-detail-overlay-card.js";
import { FortumEnergyDevicesAdaptiveGraphCard } from "./strategy/cards/devices-adaptive-graph-card.js";
import { FortumEnergyFuturePriceCard } from "./strategy/cards/future-price-card.js";
import { FortumEnergyQuickRangesCard } from "./strategy/cards/quick-ranges-card.js";
import { FortumEnergyMultipointStrategyEditor } from "./strategy/editors/multipoint-strategy-editor.js";
import { FortumEnergySingleStrategyEditor } from "./strategy/editors/single-strategy-editor.js";
import { FortumEnergySpacerCard } from "./strategy/cards/spacer-card.js";
import {
  FortumEnergyDashboardStrategy,
  FortumEnergySingleDashboardStrategy,
} from "./strategy/strategies/single-strategy.js";
import { FortumEnergyMultipointDashboardStrategy } from "./strategy/strategies/multipoint-strategy.js";
import { deriveEnergyRuntimeConfig, normalizeEnergySourceOverrides } from "./strategy/runtime-config.mjs";

const resolveIntegrationVersion = () => {
  try {
    const parsed = new URL(import.meta.url, globalThis?.location?.href);
    const version = parsed.searchParams.get("v");
    if (typeof version === "string" && version.trim().length) {
      return version.trim();
    }
  } catch (_err) {
    // Fall back below.
  }
  return "unknown";
};

globalThis.__fortumEnergyIntegrationVersion = resolveIntegrationVersion();

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
registerIfNeeded("fortum-energy-single-strategy-editor", FortumEnergySingleStrategyEditor);
registerIfNeeded("fortum-energy-multipoint-strategy-editor", FortumEnergyMultipointStrategyEditor);
try {
  registerIfNeeded(
    "ll-strategy-dashboard-fortum-energy-single",
    FortumEnergySingleDashboardStrategy
  );
  registerIfNeeded(
    "ll-strategy-dashboard-fortum-energy-multipoint",
    FortumEnergyMultipointDashboardStrategy
  );
  registerIfNeeded("ll-strategy-dashboard-fortum-energy", FortumEnergyDashboardStrategy);
} catch (err) {
  console.error("[fortum-energy] strategy registration failed", err);
}
