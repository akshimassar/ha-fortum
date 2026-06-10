export const discoverAreaForecastStatisticIds = async (hass) => {
  const statisticIds = await hass.callWS({
    type: "recorder/list_statistic_ids",
  });

  const allIds = (statisticIds || [])
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      return item?.statistic_id;
    })
    .filter((id) => typeof id === "string");

  return Array.from(new Set(allIds))
    .filter((id) => /^fortum:price_forecast_[a-z0-9_]+$/i.test(id))
    .sort();
};
