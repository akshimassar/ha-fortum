const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let validation;

test.before(async () => {
  const modulePath = path.resolve(
    __dirname,
    "../../custom_components/fortum/frontend/strategy/shared/config-validation.mjs"
  );
  validation = await import(pathToFileURL(modulePath).href);
});

test("validates single config with metering_point", () => {
  const cfg = validation.validateSingleStrategyConfig({
    debug: true,
    metering_point: {
      number: " 6094111 ",
      name: " Home ",
      temperature: " sensor.custom_temp ",
      itemization: [{ stat: "sensor.sauna", name: "Sauna" }],
    },
  });

  assert.equal(cfg.debug, true);
  assert.equal(cfg.metering_point.number, "6094111");
  assert.equal(cfg.metering_point.name, "Home");
  assert.equal(cfg.metering_point.temperature, "sensor.custom_temp");
  assert.deepEqual(cfg.metering_point.itemization, [{ stat: "sensor.sauna", name: "Sauna" }]);
});

test("rejects non-boolean debug value", () => {
  assert.throws(
    () => validation.validateSingleStrategyConfig({ debug: "yes" }),
    /strategy\.debug must be a boolean/i
  );
});

test("validates multipoint config with optional name", () => {
  const cfg = validation.validateMultipointStrategyConfig({
    metering_points: [
      {
        number: "6094111",
        name: "Home",
        temperature: " sensor.custom_temp ",
        itemization: [],
      },
    ],
  });

  assert.deepEqual(cfg.metering_points, [
    {
      number: "6094111",
      name: "Home",
      temperature: "sensor.custom_temp",
      itemization: [],
    },
  ]);
});

test("rejects multipoint config without itemization", () => {
  assert.throws(
    () =>
      validation.validateMultipointStrategyConfig({
        metering_points: [{ number: "6094111" }],
      }),
    /itemization must be a list/i
  );
});

test("accepts legacy keys without explicit rejection", () => {
  const cfg = validation.validateSingleStrategyConfig({
    fortum: { metering_point_number: "6094111" },
    itemization: [{ stat: "sensor.sauna" }],
  });

  assert.equal(cfg.fortum.metering_point_number, "6094111");
  assert.deepEqual(cfg.itemization, [{ stat: "sensor.sauna" }]);
});
