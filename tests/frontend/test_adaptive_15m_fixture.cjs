const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let bucketMath;

const toMap = (entries) =>
  new Map((Array.isArray(entries) ? entries : []).map(([k, v]) => [Number(k), Number(v)]));

test.before(async () => {
  const modulePath = path.resolve(
    __dirname,
    "../../custom_components/fortum/frontend/strategy/shared/adaptive-bucket-math.mjs"
  );
  bucketMath = await import(pathToFileURL(modulePath).href);
});

test("15m fixture keeps stretched total and zeroes missing-total buckets", () => {
  const fixturePath = path.resolve(
    __dirname,
    "./fixtures/adaptive-15m-stretched-fixture.json"
  );
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

  const result = bucketMath.computeTotalAndUntrackedByBucket({
    usedTotalByMathBucket: toMap(fixture.used_total_by_math_bucket),
    deviceTotalsByMathBucket: toMap(fixture.device_totals_by_math_bucket),
    bucketMs: fixture.bucket_ms,
    flowBucketMs: fixture.flow_bucket_ms,
  });

  assert.deepEqual(
    Array.from(result.totalConsumedByBucket.entries()).sort((a, b) => a[0] - b[0]),
    fixture.expected.total_consumed_by_bucket
  );
  assert.deepEqual(
    Array.from(result.untrackedByBucket.entries()).sort((a, b) => a[0] - b[0]),
    fixture.expected.untracked_by_bucket
  );
});
