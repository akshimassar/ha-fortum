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
    fortum: {},
    metering_points: [
      {
        number: "6094111",
        name: "No-items",
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
  assert.equal(result[0].fortum.metering_point_number, "6094111");
  assert.equal(result[0].electricity_title, "No-items");
  assert.deepEqual(result[0].itemization, []);
  assert.equal(result[1].fortum.metering_point_number, "6094111");
  assert.equal(result[1].electricity_title, "With-items");
  assert.deepEqual(result[1].itemization, [{ stat: "sensor.sauna", name: "Sauna" }]);
});

test("buildSingleConfigsFromMultipoint falls back to sensor address", () => {
  const result = runtime.buildSingleConfigsFromMultipoint(
    {
      fortum: {},
      metering_points: [
        {
          number: "6094111",
          itemization: [],
        },
      ],
    },
    {
      states: {
        "sensor.metering_point_6094111": {
          attributes: {
            address: "Test Street 1",
          },
        },
      },
    }
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].electricity_title, "Test Street 1");
  assert.equal(result[0].fortum.metering_point_number, "6094111");
});

test("resolvePointForecast enforces strict metering-point sensor lookup", () => {
  const statIds = new Set(["fortum:price_forecast_fi"]);

  const missingSensor = runtime.resolvePointForecast({ states: {} }, "6094111", statIds);
  assert.equal(
    missingSensor.forecastError,
    "Metering point sensor sensor.metering_point_6094111 is missing."
  );

  const missingArea = runtime.resolvePointForecast(
    {
      states: {
        "sensor.metering_point_6094111": { attributes: {} },
      },
    },
    "6094111",
    statIds
  );
  assert.equal(
    missingArea.forecastError,
    "Sensor sensor.metering_point_6094111 has no attribute price_area."
  );

  const missingStat = runtime.resolvePointForecast(
    {
      states: {
        "sensor.metering_point_6094111": { attributes: { price_area: "SE3" } },
      },
    },
    "6094111",
    statIds
  );
  assert.equal(missingStat.forecastError, "Price statistic fortum:price_forecast_se3 has no values.");

  const ok = runtime.resolvePointForecast(
    {
      states: {
        "sensor.metering_point_6094111": { attributes: { price_area: "FI" } },
      },
    },
    "6094111",
    statIds
  );
  assert.deepEqual(ok.forecastIds, ["fortum:price_forecast_fi"]);
  assert.equal(ok.forecastError, null);
});
