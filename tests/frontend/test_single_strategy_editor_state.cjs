const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let editorState;

test.before(async () => {
  const modulePath = path.resolve(
    __dirname,
    "../../custom_components/fortum/frontend/strategy/editors/single-strategy-editor-state.mjs"
  );
  editorState = await import(pathToFileURL(modulePath).href);
});

test("normalizeItemizationRows keeps valid rows only", () => {
  const normalized = editorState.normalizeItemizationRows([
    { stat: " sensor.sauna ", name: " Sauna " },
    { stat: "" },
    { stat: "   " },
    null,
  ]);

  assert.deepEqual(normalized, [{ stat: "sensor.sauna", name: "Sauna" }]);
});

test("createSingleEditorStateFromConfig captures explicit itemization", () => {
  const state = editorState.createSingleEditorStateFromConfig({
    type: "custom:fortum-energy-single",
    debug: true,
    metering_point: {
      number: "6094111",
      name: "Home",
      temperature: "sensor.custom_temp",
      itemization: [{ stat: "sensor.sauna", name: "Sauna" }],
    },
  });

  assert.equal(state.debug, true);
  assert.equal(state.meteringPointNumber, "6094111");
  assert.equal(state.meteringPointName, "Home");
  assert.equal(state.meteringPointTemperature, "sensor.custom_temp");
  assert.equal(state.hasExplicitItemization, true);
  assert.deepEqual(state.itemizationRows, [{ stat: "sensor.sauna", name: "Sauna" }]);
});

test("buildSingleConfigFromEditorState preserves unknown keys", () => {
  const config = editorState.buildSingleConfigFromEditorState({
    baseConfig: {
      type: "custom:fortum-energy-single",
      collection_key: "energy_custom_dashboard",
      electricity_title: "Home",
    },
    meteringPointNumber: " 6094111 ",
    meteringPointName: " Home ",
    meteringPointTemperature: " sensor.custom_temp ",
    debug: false,
    hasExplicitItemization: false,
    itemizationRows: [],
  });

  assert.deepEqual(config, {
    type: "custom:fortum-energy-single",
    collection_key: "energy_custom_dashboard",
    electricity_title: "Home",
    metering_point: { number: "6094111", name: "Home", temperature: "sensor.custom_temp" },
  });
});

test("buildSingleConfigFromEditorState writes explicit empty itemization", () => {
  const config = editorState.buildSingleConfigFromEditorState({
    baseConfig: { type: "custom:fortum-energy-single", debug: true },
    meteringPointNumber: "",
    meteringPointName: "",
    meteringPointTemperature: "",
    debug: true,
    hasExplicitItemization: true,
    itemizationRows: [{ stat: "   ", name: "ignored" }],
  });

  assert.deepEqual(config, {
    type: "custom:fortum-energy-single",
    debug: true,
    metering_point: {
      itemization: [],
    },
  });
});

test("buildSingleConfigFromEditorState keeps config free of editor backup", () => {
  const config = editorState.buildSingleConfigFromEditorState({
    baseConfig: {
      type: "custom:fortum-energy-single",
      metering_point: {
        number: "6094111",
      },
      fortum: {
        metering_point_number: "legacy",
      },
      itemization: [{ stat: "sensor.old", name: "Old" }],
    },
    meteringPointNumber: "6094111",
    meteringPointName: "",
    meteringPointTemperature: "",
    debug: false,
    hasExplicitItemization: false,
    itemizationRows: [],
  });

  assert.deepEqual(config, {
    type: "custom:fortum-energy-single",
    metering_point: {
      number: "6094111",
    },
  });
});
