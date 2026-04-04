const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let runtime;

test.before(async () => {
  const modulePath = path.resolve(
    __dirname,
    "../../custom_components/fortum/frontend/strategy/shared/multipoint-runtime.mjs"
  );
  runtime = await import(pathToFileURL(modulePath).href);
});

test("buildSingleConfigsFromMultipoint preserves one config per point", () => {
  const result = runtime.buildSingleConfigsFromMultipoint({
    metering_points: [
      {
        number: "6094111",
        name: "No-items",
        temperature: "sensor.custom_temp",
        itemization: [],
      },
      {
        number: "6094111",
        name: "With-items",
        itemization: [{ stat: "sensor.sauna", name: "Sauna" }],
      },
    ],
  });

  assert.equal(result.length, 2);
  assert.equal(result[0].metering_point.number, "6094111");
  assert.equal(result[0].metering_point.temperature, "sensor.custom_temp");
  assert.equal(result[0].electricity_title, "No-items");
  assert.deepEqual(result[0].metering_point.itemization, []);
  assert.equal(result[1].metering_point.number, "6094111");
  assert.equal(result[1].electricity_title, "With-items");
  assert.deepEqual(result[1].metering_point.itemization, [{ stat: "sensor.sauna", name: "Sauna" }]);
});

test("buildSingleConfigsFromMultipoint falls back to sensor address", () => {
  const result = runtime.buildSingleConfigsFromMultipoint(
    {
      metering_points: [
        {
          number: "6094111",
          itemization: [],
        },
      ],
    },
    {
      states: {
        "sensor.cabin_meter": {
          attributes: {
            metering_point_no: "6094111",
            address: "Test Street 1",
          },
        },
      },
    }
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].electricity_title, "Test Street 1");
  assert.equal(result[0].metering_point.number, "6094111");
});

test("resolvePointForecast uses metering_point_no attribute discovery", () => {
  const statIds = new Set(["fortum:price_forecast_fi"]);

  const missingSensor = runtime.resolvePointForecast({ states: {} }, "6094111", statIds);
  assert.equal(
    missingSensor.forecastError,
    "Metering point sensor with metering_point_no=6094111 is missing."
  );

  const missingArea = runtime.resolvePointForecast(
    {
      states: {
        "sensor.cabin_meter": { attributes: { metering_point_no: "6094111" } },
      },
    },
    "6094111",
    statIds
  );
  assert.equal(
    missingArea.forecastError,
    "Sensor sensor.cabin_meter has no attribute price_area."
  );

  const missingStat = runtime.resolvePointForecast(
    {
      states: {
        "sensor.cabin_meter": {
          attributes: { metering_point_no: "6094111", price_area: "SE3" },
        },
      },
    },
    "6094111",
    statIds
  );
  assert.equal(missingStat.forecastError, "Price statistic fortum:price_forecast_se3 has no values.");

  const ok = runtime.resolvePointForecast(
    {
      states: {
        "sensor.cabin_meter": {
          attributes: { metering_point_no: "6094111", price_area: "FI" },
        },
      },
    },
    "6094111",
    statIds
  );
  assert.deepEqual(ok.forecastIds, ["fortum:price_forecast_fi"]);
  assert.equal(ok.forecastError, null);
});
