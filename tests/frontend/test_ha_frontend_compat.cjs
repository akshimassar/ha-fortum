const test = require("node:test");
const assert = require("node:assert/strict");
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const haFrontendRoot = path.resolve(root, "ha-frontend/home-assistant-frontend");
const markerPath = path.resolve(root, "ha-frontend-release.json");

const hasFrontendClone = fs.existsSync(path.join(haFrontendRoot, ".git"));
const marker = JSON.parse(fs.readFileSync(markerPath, "utf8"));

const findExistingFile = (candidates) => {
  for (const relativePath of candidates) {
    const absolutePath = path.join(haFrontendRoot, relativePath);
    if (fs.existsSync(absolutePath)) {
      return absolutePath;
    }
  }
  return null;
};

const readLocalFrontendFile = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test(
  "HA frontend clone canary is present",
  { skip: !hasFrontendClone },
  () => {
    assert.ok(hasFrontendClone);
  }
);

test("tracked HA frontend release marker is valid", () => {
  assert.equal(marker.repository, "home-assistant/frontend");
  assert.match(marker.tag, /^\d{8}\.\d+[A-Za-z0-9.-]*$/);
  assert.match(marker.commit, /^[0-9a-f]{40}$/);
});

test(
  "local HA frontend clone matches tracked release marker",
  { skip: !hasFrontendClone },
  () => {
    const localTag = execSync("git describe --tags --exact-match HEAD", {
      cwd: haFrontendRoot,
      encoding: "utf8",
    }).trim();
    const localCommit = execSync("git rev-parse HEAD", {
      cwd: haFrontendRoot,
      encoding: "utf8",
    }).trim();
    assert.equal(localTag, marker.tag);
    assert.equal(localCommit, marker.commit);
  }
);

test(
  "ha-statistic-picker contract still exposes expected internals",
  { skip: !hasFrontendClone },
  () => {
    const pickerFile = findExistingFile([
      "src/components/entity/ha-statistic-picker.ts",
      "src/components/entity/ha-statistic-picker.tsx",
      "src/components/ha-statistic-picker.ts",
      "src/components/ha-statistic-picker.tsx",
    ]);
    assert.ok(pickerFile, "Could not find ha-statistic-picker source in cloned HA frontend");

    const source = fs.readFileSync(pickerFile, "utf8");
    assert.match(source, /ha-statistic-picker/, "Expected ha-statistic-picker tag in source");
    assert.match(
      source,
      /_getAdditionalItems\s*=\s*\(/,
      "ha-statistic-picker no longer exposes _getAdditionalItems; review editor overrides"
    );
  }
);

test(
  "ha-selector and ha-chart-base still exist in HA frontend",
  { skip: !hasFrontendClone },
  () => {
    const selectorFile = findExistingFile([
      "src/components/ha-selector/ha-selector.ts",
      "src/components/ha-selector/ha-selector.tsx",
    ]);
    assert.ok(selectorFile, "Could not find ha-selector source in cloned HA frontend");
    assert.match(fs.readFileSync(selectorFile, "utf8"), /ha-selector/);

    const chartFile = findExistingFile([
      "src/components/chart/ha-chart-base.ts",
      "src/components/chart/ha-chart-base.tsx",
    ]);
    assert.ok(chartFile, "Could not find ha-chart-base source in cloned HA frontend");
    assert.match(fs.readFileSync(chartFile, "utf8"), /ha-chart-base/);
  }
);

test("local editors keep guarded override for _getAdditionalItems", () => {
  const singleEditor = readLocalFrontendFile(
    "custom_components/fortum/frontend/strategy/editors/single-strategy-editor.js"
  );
  const multipointEditor = readLocalFrontendFile(
    "custom_components/fortum/frontend/strategy/editors/multipoint-strategy-editor.js"
  );

  assert.match(singleEditor, /typeof\s+picker\._getAdditionalItems\s*===\s*"function"/);
  assert.match(singleEditor, /try\s*\{/);
  assert.match(multipointEditor, /typeof\s+picker\._getAdditionalItems\s*===\s*"function"/);
  assert.match(multipointEditor, /try\s*\{/);
});
