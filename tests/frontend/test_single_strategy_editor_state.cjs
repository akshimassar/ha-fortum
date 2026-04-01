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
    fortum: { metering_point_number: "6094111" },
    itemization: [{ stat: "sensor.sauna", name: "Sauna" }],
  });

  assert.equal(state.debug, true);
  assert.equal(state.meteringPointNumber, "6094111");
  assert.equal(state.hasExplicitItemization, true);
  assert.deepEqual(state.itemizationRows, [{ stat: "sensor.sauna", name: "Sauna" }]);
  assert.deepEqual(state.itemizationBackupRows, [{ stat: "sensor.sauna", name: "Sauna" }]);
});

test("createSingleEditorStateFromConfig reads editor itemization backup", () => {
  const state = editorState.createSingleEditorStateFromConfig({
    type: "custom:fortum-energy-single",
    fortum: {
      editor: {
        itemization_backup: {
          v: 1,
          single: [{ stat: "sensor.dryer", name: "Dryer" }],
          multipoint: {
            "6094111": [{ stat: "sensor.ev", name: "EV" }],
          },
        },
      },
    },
  });

  assert.equal(state.hasExplicitItemization, false);
  assert.deepEqual(state.itemizationRows, []);
  assert.deepEqual(state.itemizationBackupRows, [{ stat: "sensor.dryer", name: "Dryer" }]);
});

test("createSingleEditorStateFromConfig ignores legacy backup format", () => {
  const state = editorState.createSingleEditorStateFromConfig({
    type: "custom:fortum-energy-single",
    fortum: {
      editor: {
        itemization_backup: [{ stat: "sensor.legacy", name: "Legacy" }],
      },
    },
  });

  assert.equal(state.itemizationBackupRows, undefined);
});

test("buildSingleConfigFromEditorState preserves unknown keys", () => {
  const config = editorState.buildSingleConfigFromEditorState({
    baseConfig: {
      type: "custom:fortum-energy-single",
      collection_key: "energy_custom_dashboard",
      electricity_title: "Home",
    },
    meteringPointNumber: " 6094111 ",
    debug: false,
    hasExplicitItemization: false,
    itemizationRows: [],
  });

  assert.deepEqual(config, {
    type: "custom:fortum-energy-single",
    collection_key: "energy_custom_dashboard",
    electricity_title: "Home",
    fortum: { metering_point_number: "6094111" },
  });
});

test("buildSingleConfigFromEditorState writes explicit empty itemization", () => {
  const config = editorState.buildSingleConfigFromEditorState({
    baseConfig: { type: "custom:fortum-energy-single", debug: true },
    meteringPointNumber: "",
    debug: true,
    hasExplicitItemization: true,
    itemizationRows: [{ stat: "   ", name: "ignored" }],
  });

  assert.deepEqual(config, {
    type: "custom:fortum-energy-single",
    debug: true,
    itemization: [],
    fortum: {
      editor: {
        itemization_backup: {
          v: 1,
          single: [],
        },
      },
    },
  });
});

test("buildSingleConfigFromEditorState preserves backup in energy mode", () => {
  const config = editorState.buildSingleConfigFromEditorState({
    baseConfig: { type: "custom:fortum-energy-single" },
    meteringPointNumber: "",
    debug: false,
    hasExplicitItemization: false,
    itemizationRows: [],
    itemizationBackupRows: [{ stat: "sensor.sauna", name: "Sauna" }],
  });

  assert.deepEqual(config, {
    type: "custom:fortum-energy-single",
    fortum: {
      editor: {
        itemization_backup: {
          v: 1,
          single: [{ stat: "sensor.sauna", name: "Sauna" }],
        },
      },
    },
  });
});

test("buildSingleConfigFromEditorState preserves multipoint backup branch", () => {
  const config = editorState.buildSingleConfigFromEditorState({
    baseConfig: {
      type: "custom:fortum-energy-single",
      fortum: {
        editor: {
          itemization_backup: {
            v: 1,
            multipoint: {
              "6094111": [{ stat: "sensor.old", name: "Old" }],
            },
          },
        },
      },
    },
    meteringPointNumber: "",
    debug: false,
    hasExplicitItemization: false,
    itemizationRows: [],
    itemizationBackupRows: [{ stat: "sensor.sauna", name: "Sauna" }],
  });

  assert.deepEqual(config, {
    type: "custom:fortum-energy-single",
    fortum: {
      editor: {
        itemization_backup: {
          v: 1,
          single: [{ stat: "sensor.sauna", name: "Sauna" }],
          multipoint: {
            "6094111": [{ stat: "sensor.old", name: "Old" }],
          },
        },
      },
    },
  });
});
