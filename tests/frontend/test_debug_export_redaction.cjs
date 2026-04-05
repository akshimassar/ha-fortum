const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let redaction;

test.before(async () => {
  const modulePath = path.resolve(
    __dirname,
    "../../custom_components/fortum/frontend/strategy/shared/debug-export-redaction.mjs"
  );
  redaction = await import(pathToFileURL(modulePath).href);
});

test("sanitizeDiagnosticsPayload redacts personal and token values", () => {
  const payload = {
    username: "PERSONAL_username",
    password: "secret-password",
    access_token: "secret-token",
    user: {
      name: "PERSONAL_name",
      address: "PERSONAL_address",
      label: "PERSONAL_label",
      number: "6094111",
      metering_point_no: "PERSONAL_metering_point",
    },
    entity_ids: ["sensor.personal_meter", "sensor.personal_meter"],
    diagnostics_message:
      'request failed authorization=Bearer PERSONAL_auth token=abc123 {"refresh_token":"xyz"}',
  };

  const sanitized = redaction.sanitizeDiagnosticsPayload(payload);
  const text = JSON.stringify(sanitized);

  assert.equal(sanitized.password, "[REDACTED]");
  assert.equal(sanitized.access_token, "[REDACTED]");
  assert.equal(sanitized.user.number, "6094111");
  assert.match(sanitized.user.name, /^\[REDACTED name \d+\]$/);
  assert.match(sanitized.user.address, /^\[REDACTED address \d+\]$/);
  assert.match(sanitized.user.label, /^\[REDACTED label \d+\]$/);
  assert.match(
    sanitized.user.metering_point_no,
    /^\[REDACTED metering_point_no \d+\]$/
  );
  assert.match(sanitized.entity_ids[0], /^\[REDACTED entity_id \d+\]$/);
  assert.equal(sanitized.entity_ids[0], sanitized.entity_ids[1]);

  assert.ok(!text.includes("PERSONAL_"));
  assert.ok(!text.includes("secret-password"));
  assert.ok(!text.includes("secret-token"));
  assert.ok(!text.includes("abc123"));
  assert.ok(!text.includes('"refresh_token":"xyz"'));
  assert.ok(text.includes("[REDACTED]"));
});

test("sanitizeDiagnosticsPayload keeps deterministic labels for same value", () => {
  const payload = {
    primary: {
      name: "same-person",
      label: "same-person",
    },
    secondary: {
      address: "same-person",
      entity_id: "same-person",
    },
  };

  const sanitized = redaction.sanitizeDiagnosticsPayload(payload);

  const expected = sanitized.primary.name;
  assert.match(expected, /^\[REDACTED [a-z0-9_]+ \d+\]$/);
  assert.equal(sanitized.primary.label, expected);
  assert.equal(sanitized.secondary.address, expected);
  assert.equal(sanitized.secondary.entity_id, expected);
});

test("sanitizeDiagnosticsPayload keeps numeric metering point identifiers", () => {
  const payload = {
    metering_point_no: " 7000222 ",
    nested: {
      number: " 1234567 ",
    },
  };

  const sanitized = redaction.sanitizeDiagnosticsPayload(payload);

  assert.equal(sanitized.metering_point_no, "7000222");
  assert.equal(sanitized.nested.number, "1234567");
});
