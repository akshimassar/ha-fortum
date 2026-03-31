const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let hooks;

test.before(async () => {
  const modulePath = path.resolve(
    __dirname,
    "../../custom_components/fortum/frontend/strategy/shared/adaptive-bucket-math.mjs"
  );
  hooks = await import(pathToFileURL(modulePath).href);
});

test("3h buckets keep math balanced where total exists", () => {
  const used = new Map([
    [1000, 10],
    [4000, 5],
  ]);
  const device = new Map([
    [1000, 7],
    [4000, 7],
  ]);

  const { totalConsumedByBucket, untrackedByBucket } = hooks.computeTotalAndUntrackedByBucket({
    usedTotalByMathBucket: used,
    deviceTotalsByMathBucket: device,
    bucketMs: 3 * 60 * 60 * 1000,
    flowBucketMs: 60 * 60 * 1000,
  });

  assert.equal(totalConsumedByBucket.get(1000), 10);
  assert.equal(untrackedByBucket.get(1000), 3);
  assert.equal(totalConsumedByBucket.get(4000), 5);
  assert.equal(untrackedByBucket.get(4000), -2);
});

test("missing total buckets are zeroed for total and untracked", () => {
  const used = new Map([[1000, 10]]);
  const device = new Map([
    [1000, 7],
    [7000, 4],
  ]);

  const { totalConsumedByBucket, untrackedByBucket } = hooks.computeTotalAndUntrackedByBucket({
    usedTotalByMathBucket: used,
    deviceTotalsByMathBucket: device,
    bucketMs: 3 * 60 * 60 * 1000,
    flowBucketMs: 60 * 60 * 1000,
  });

  assert.equal(totalConsumedByBucket.get(7000), 0);
  assert.equal(untrackedByBucket.get(7000), 0);
});

test("15m stretched mode keeps totals in first bucket", () => {
  const hour = 3600000;
  const used = new Map([[hour, 8]]);
  const device = new Map([[hour, 5]]);

  const { totalConsumedByBucket, untrackedByBucket } = hooks.computeTotalAndUntrackedByBucket({
    usedTotalByMathBucket: used,
    deviceTotalsByMathBucket: device,
    bucketMs: 15 * 60 * 1000,
    flowBucketMs: 60 * 60 * 1000,
  });

  assert.equal(totalConsumedByBucket.get(hour), 8);
  assert.equal(untrackedByBucket.get(hour), 3);
});
