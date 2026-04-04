const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let discovery;

test.before(async () => {
  const modulePath = path.resolve(
    __dirname,
    "../../custom_components/fortum/frontend/strategy/shared/metering-point-discovery.mjs"
  );
  discovery = await import(pathToFileURL(modulePath).href);
});

test("listDiscoverableMeteringPoints discovers by attributes.metering_point_no", () => {
  const points = discovery.listDiscoverableMeteringPoints({
    states: {
      "sensor.random_name": {
        attributes: {
          metering_point_no: "7000222",
          address: "Cabin road 2",
        },
      },
      "sensor.other_name": {
        attributes: {
          metering_point_no: "6094111",
          address: "Main street 1",
        },
      },
      "sensor.unrelated": {
        attributes: {
          some_other_attr: "x",
        },
      },
    },
  });

  assert.deepEqual(points.map((point) => point.number), ["6094111", "7000222"]);
  assert.equal(points[0].label, "Main street 1 (6094111)");
  assert.equal(points[1].label, "Cabin road 2 (7000222)");
});

test("findMeteringPointStateByNumber does not rely on entity id format", () => {
  const match = discovery.findMeteringPointStateByNumber(
    {
      states: {
        "sensor.custom_meter_entity": {
          attributes: {
            metering_point_no: "6094111",
            price_area: "NO1",
          },
        },
      },
    },
    "6094111"
  );

  assert.equal(match.entityId, "sensor.custom_meter_entity");
  assert.equal(match.stateObj.attributes.price_area, "NO1");
});
