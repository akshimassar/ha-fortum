const DEFAULT_COLLECTION_KEY = "energy_my_energy_dashboard";

const EMPTY_PREFS = {
  energy_sources: [],
  device_consumption: [],
  device_consumption_water: [],
};

const LARGE_SCREEN_CONDITION = {
  condition: "screen",
  media_query: "(min-width: 871px)",
};

const SMALL_SCREEN_CONDITION = {
  condition: "not",
  conditions: [LARGE_SCREEN_CONDITION],
};

const VIEW_TITLE_FALLBACKS = {
  overview: "Overview",
  electricity: "Electricity",
  gas: "Gas",
  water: "Water",
  now: "Power",
  setup: "Setup",
};

const hasAnyEnergyPrefs = (prefs) =>
  prefs &&
  (prefs.device_consumption.length > 0 || prefs.energy_sources.length > 0);

const fetchEnergyPrefs = async (hass) => {
  try {
    const prefs = await hass.callWS({ type: "energy/get_prefs" });
    return prefs || EMPTY_PREFS;
  } catch (err) {
    if (err && err.code === "not_found") {
      return EMPTY_PREFS;
    }
    throw err;
  }
};

const localize = (hass, key, fallback) => hass.localize?.(key) || fallback;

const localizeViewTitle = (hass, path) => {
  const key = `ui.panel.energy.title.${path}`;
  return localize(hass, key, VIEW_TITLE_FALLBACKS[path] || path);
};

const buildEmptySectionsView = (collectionKey) => ({
  type: "sections",
  sections: [],
  footer: {
    card: {
      type: "energy-date-selection",
      collection_key: collectionKey,
      opening_direction: "right",
      vertical_opening_direction: "up",
    },
  },
});

const buildOverviewViewConfig = (prefs, collectionKey, hass) => {
  const view = {
    type: "sections",
    sections: [],
    dense_section_placement: true,
    max_columns: 3,
    footer: {
      card: {
        type: "energy-date-selection",
        collection_key: collectionKey,
        opening_direction: "right",
        vertical_opening_direction: "up",
      },
    },
  };

  const hasGrid = prefs.energy_sources.some(
    (source) =>
      source.type === "grid" &&
      (!!source.stat_energy_from || !!source.stat_energy_to)
  );
  const hasGas = prefs.energy_sources.some((source) => source.type === "gas");
  const hasBattery = prefs.energy_sources.some(
    (source) => source.type === "battery"
  );
  const hasWaterSources = prefs.energy_sources.some(
    (source) => source.type === "water"
  );
  const hasWaterDevices = prefs.device_consumption_water?.length;
  const hasPowerSources = prefs.energy_sources.some((source) => {
    if (source.type === "solar" && source.stat_rate) return true;
    if (source.type === "battery" && source.stat_rate) return true;
    if (source.type === "grid") {
      return !!source.stat_rate || !!source.power_config;
    }
    return false;
  });

  if (prefs.energy_sources.length) {
    view.sections.push({
      type: "grid",
      cards: [
        {
          title: localize(
            hass,
            "ui.panel.energy.cards.energy_sources_table_title",
            "Energy sources"
          ),
          type: "energy-sources-table",
          collection_key: collectionKey,
          show_only_totals: true,
        },
      ],
    });
  }

  if (hasPowerSources) {
    view.sections.push({
      type: "grid",
      cards: [
        {
          title: localize(
            hass,
            "ui.panel.energy.cards.power_sources_graph_title",
            "Power sources"
          ),
          type: "power-sources-graph",
          collection_key: collectionKey,
          show_legend: false,
        },
      ],
    });
  }

  if (hasGrid || hasBattery) {
    view.sections.push({
      type: "grid",
      cards: [
        {
          title: localize(
            hass,
            "ui.panel.energy.cards.energy_usage_graph_title",
            "Energy usage"
          ),
          type: "energy-usage-graph",
          collection_key: collectionKey,
        },
      ],
    });
  }

  if (hasGas) {
    view.sections.push({
      type: "grid",
      cards: [
        {
          title: localize(
            hass,
            "ui.panel.energy.cards.energy_gas_graph_title",
            "Gas consumption"
          ),
          type: "energy-gas-graph",
          collection_key: collectionKey,
        },
      ],
    });
  }

  if (hasWaterSources || hasWaterDevices) {
    view.sections.push({
      type: "grid",
      cards: [
        hasWaterSources
          ? {
              title: localize(
                hass,
                "ui.panel.energy.cards.energy_water_graph_title",
                "Water consumption"
              ),
              type: "energy-water-graph",
              collection_key: collectionKey,
            }
          : {
              title: localize(
                hass,
                "ui.panel.energy.cards.water_sankey_title",
                "Water flow"
              ),
              type: "water-sankey",
              collection_key: collectionKey,
            },
      ],
    });
  }

  return view;
};

const buildElectricityViewConfig = (prefs, collectionKey, hass) => {
  const view = {
    type: "sections",
    sections: [],
    sidebar: {
      sections: [{ cards: [] }],
      visibility: [LARGE_SCREEN_CONDITION],
    },
    footer: {
      card: {
        type: "energy-date-selection",
        collection_key: collectionKey,
        opening_direction: "right",
        vertical_opening_direction: "up",
      },
    },
  };

  const hasGrid = prefs.energy_sources.some(
    (source) =>
      source.type === "grid" &&
      (!!source.stat_energy_from || !!source.stat_energy_to)
  );
  const hasReturn = prefs.energy_sources.some(
    (source) => source.type === "grid" && !!source.stat_energy_to
  );
  const hasSolar = prefs.energy_sources.some(
    (source) => source.type === "solar"
  );
  const hasBattery = prefs.energy_sources.some(
    (source) => source.type === "battery"
  );

  const mainCards = [];
  const gaugeCards = [];
  const sidebarSection = view.sidebar.sections[0];

  if (hasReturn) {
    gaugeCards.push({
      type: "energy-grid-neutrality-gauge",
      collection_key: collectionKey,
    });
  }

  if (hasSolar) {
    if (hasReturn) {
      gaugeCards.push({
        type: "energy-solar-consumed-gauge",
        collection_key: collectionKey,
      });
    }
    if (hasGrid) {
      gaugeCards.push({
        type: "energy-self-sufficiency-gauge",
        collection_key: collectionKey,
      });
    }
  }

  if (hasGrid) {
    gaugeCards.push({
      type: "energy-carbon-consumed-gauge",
      collection_key: collectionKey,
    });
  }

  if (gaugeCards.length) {
    sidebarSection.cards.push({
      type: "grid",
      columns: gaugeCards.length === 1 ? 1 : 2,
      cards: gaugeCards,
    });
    view.sections.push({
      type: "grid",
      column_span: 1,
      visibility: [SMALL_SCREEN_CONDITION],
      cards:
        gaugeCards.length === 1
          ? [gaugeCards[0]]
          : gaugeCards.map((card) => ({
              ...card,
              grid_options: { columns: 6 },
            })),
    });
  }

  mainCards.push({
    type: "energy-compare",
    collection_key: collectionKey,
    grid_options: { columns: 36 },
  });

  if (hasGrid || hasBattery) {
    mainCards.push({
      title: localize(
        hass,
        "ui.panel.energy.cards.energy_usage_graph_title",
        "Energy usage"
      ),
      type: "energy-usage-graph",
      collection_key: collectionKey,
      grid_options: { columns: 36 },
    });
  }

  if (hasSolar) {
    mainCards.push({
      title: localize(
        hass,
        "ui.panel.energy.cards.energy_solar_graph_title",
        "Solar production"
      ),
      type: "energy-solar-graph",
      collection_key: collectionKey,
      grid_options: { columns: 36 },
    });
  }

  if (hasGrid || hasSolar || hasBattery) {
    mainCards.push({
      title: localize(
        hass,
        "ui.panel.energy.cards.energy_sources_table_title",
        "Energy sources"
      ),
      type: "energy-sources-table",
      collection_key: collectionKey,
      types: ["grid", "solar", "battery"],
      grid_options: { columns: 36 },
    });
  }

  if (prefs.device_consumption.length) {
    mainCards.push({
      title: localize(
        hass,
        "ui.panel.energy.cards.energy_devices_detail_graph_title",
        "Individual devices"
      ),
      type: "energy-devices-detail-graph",
      collection_key: collectionKey,
      grid_options: { columns: 36 },
    });
    mainCards.push({
      title: localize(
        hass,
        "ui.panel.energy.cards.energy_devices_graph_title",
        "Device consumption"
      ),
      type: "energy-devices-graph",
      collection_key: collectionKey,
      grid_options: { columns: 36 },
    });
  }

  view.sections.push({
    type: "grid",
    column_span: 3,
    cards: mainCards,
  });

  return view;
};

const buildDashboardViews = (prefs, collectionKey) => {
  const overviewView = {
    path: "overview",
    strategy: {
      type: "custom:my-energy-overview",
      collection_key: collectionKey,
    },
  };

  const electricityView = {
    path: "electricity",
    strategy: {
      type: "custom:my-energy-electricity",
      collection_key: collectionKey,
    },
  };

  const waterView = {
    path: "water",
    strategy: {
      type: "water",
      collection_key: collectionKey,
    },
  };

  const gasView = {
    path: "gas",
    strategy: {
      type: "gas",
      collection_key: collectionKey,
    },
  };

  const powerView = {
    path: "now",
    strategy: {
      type: "power",
      collection_key: collectionKey,
    },
  };

  const hasEnergy = prefs.energy_sources.some((source) =>
    ["grid", "solar", "battery"].includes(source.type)
  );
  const hasPowerSource = prefs.energy_sources.some((source) => {
    if (source.type === "solar" && source.stat_rate) return true;
    if (source.type === "battery" && source.stat_rate) return true;
    if (source.type === "grid") {
      return !!source.stat_rate || !!source.power_config;
    }
    return false;
  });
  const hasDevicePower = prefs.device_consumption.some(
    (device) => device.stat_rate
  );
  const hasPower = hasPowerSource || hasDevicePower;
  const hasWater =
    prefs.energy_sources.some((source) => source.type === "water") ||
    prefs.device_consumption_water.length > 0;
  const hasGas = prefs.energy_sources.some((source) => source.type === "gas");
  const hasDeviceConsumption = prefs.device_consumption.length > 0;

  const views = [];
  if (hasEnergy || hasDeviceConsumption) {
    views.push(electricityView);
  }
  if (hasGas) {
    views.push(gasView);
  }
  if (hasWater) {
    views.push(waterView);
  }
  if (hasPower) {
    views.push(powerView);
  }
  if (hasPowerSource || [hasEnergy, hasGas, hasWater].filter(Boolean).length > 1) {
    views.unshift(overviewView);
  }
  return views;
};

const buildSetupView = () => ({
  title: VIEW_TITLE_FALLBACKS.setup,
  path: "setup",
  cards: [
    {
      type: "markdown",
      content:
        "No Energy preferences found yet. Open **Settings -> Dashboards -> Energy** and complete setup first.",
    },
  ],
});

class MyEnergyDashboardStrategy {
  static async generate(config, hass) {
    try {
      const collectionKey =
        config.collection_key || config.collectionKey || DEFAULT_COLLECTION_KEY;
      const prefs = await fetchEnergyPrefs(hass);

      if (!hasAnyEnergyPrefs(prefs)) {
        return { views: [buildSetupView()] };
      }

      const generatedViews = buildDashboardViews(prefs, collectionKey);
      return {
        views: generatedViews.map((view) => ({
          ...view,
          title: view.title || localizeViewTitle(hass, view.path),
        })),
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
                content: `Error loading my-energy strategy:\n> ${message}`,
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

class MyEnergyOverviewViewStrategy {
  static async generate(config, hass) {
    const collectionKey =
      config.collection_key || config.collectionKey || DEFAULT_COLLECTION_KEY;
    const prefs = await fetchEnergyPrefs(hass);
    if (!hasAnyEnergyPrefs(prefs)) {
      return buildEmptySectionsView(collectionKey);
    }
    return buildOverviewViewConfig(prefs, collectionKey, hass);
  }

  static async generateView(args) {
    return this.generate(args.view?.strategy || {}, args.hass);
  }
}

class MyEnergyElectricityViewStrategy {
  static async generate(config, hass) {
    const collectionKey =
      config.collection_key || config.collectionKey || DEFAULT_COLLECTION_KEY;
    const prefs = await fetchEnergyPrefs(hass);
    if (!hasAnyEnergyPrefs(prefs)) {
      return buildEmptySectionsView(collectionKey);
    }
    return buildElectricityViewConfig(prefs, collectionKey, hass);
  }

  static async generateView(args) {
    return this.generate(args.view?.strategy || {}, args.hass);
  }
}

const registerIfNeeded = (tag, klass) => {
  if (!customElements.get(tag)) {
    customElements.define(tag, klass);
  }
};

registerIfNeeded("ll-strategy-dashboard-my-energy", MyEnergyDashboardStrategy);
registerIfNeeded("ll-strategy-my-energy", MyEnergyDashboardStrategy);

registerIfNeeded("ll-strategy-view-my-energy-overview", MyEnergyOverviewViewStrategy);
registerIfNeeded("ll-strategy-my-energy-overview", MyEnergyOverviewViewStrategy);

registerIfNeeded(
  "ll-strategy-view-my-energy-electricity",
  MyEnergyElectricityViewStrategy
);
registerIfNeeded(
  "ll-strategy-my-energy-electricity",
  MyEnergyElectricityViewStrategy
);
