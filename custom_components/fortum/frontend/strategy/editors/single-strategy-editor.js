import { validateSingleStrategyConfig } from "/fortum-energy-static/strategy/shared/config-validation.mjs";
import {
  buildSingleConfigFromEditorState,
  createSingleEditorStateFromConfig,
} from "/fortum-energy-static/strategy/editors/single-strategy-editor-state.mjs";

const emitConfigChanged = (element, config) => {
  element.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    })
  );
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export class FortumEnergySingleStrategyEditor extends HTMLElement {
  connectedCallback() {
    this._maybeEnsureStatisticPickerLoaded();
  }

  setConfig(config) {
    this._state = createSingleEditorStateFromConfig(config);
    this._error = "";
    this._statisticPickerAvailable = Boolean(customElements.get("ha-statistic-picker"));

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    this._render();
    this._maybeEnsureStatisticPickerLoaded();
  }

  set hass(value) {
    this._hass = value;
    this._applyStatisticPickerProps();
    this._maybeEnsureStatisticPickerLoaded();
  }

  get hass() {
    return this._hass;
  }

  _render() {
    if (!this.shadowRoot || !this._state) {
      return;
    }

    const hasStatisticPicker =
      this._statisticPickerAvailable ?? Boolean(customElements.get("ha-statistic-picker"));
    const rows = this._state.itemizationRows;
    const rowsHtml = this._state.hasExplicitItemization
      ? rows
          .map(
            (row, index) => `
          <div class="item-row" data-index="${index}">
            ${
              hasStatisticPicker
                ? `<ha-statistic-picker
                    data-field="stat"
                    data-index="${index}"
                    class="stat-picker"
                    hide-clear-icon
                  ></ha-statistic-picker>`
                : `<input
                    data-field="stat"
                    data-index="${index}"
                    class="input stat"
                    type="text"
                    placeholder="statistic id"
                    value="${escapeHtml(row?.stat || "")}"
                  />`
            }
            <input
              data-field="name"
              data-index="${index}"
              class="input name"
              type="text"
              placeholder="optional name"
              value="${escapeHtml(row?.name || "")}"
            />
            <button type="button" class="remove" data-action="remove-item" data-index="${index}">
              Remove
            </button>
          </div>`
          )
          .join("")
      : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          color: var(--primary-text-color);
        }
        .wrapper {
          display: grid;
          gap: 16px;
        }
        .field {
          display: grid;
          gap: 6px;
        }
        .label {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-text-color);
        }
        .hint {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
        .input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid var(--input-border-color, var(--divider-color));
          border-radius: 10px;
          min-height: 40px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          padding: 8px 10px;
        }
        .row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .checkbox {
          width: 18px;
          height: 18px;
        }
        .itemization {
          display: grid;
          gap: 10px;
        }
        .mode-option {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .item-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
        }
        .stat-picker {
          width: 100%;
        }
        .actions {
          display: flex;
        }
        button {
          border: 1px solid var(--divider-color);
          border-radius: 10px;
          background: transparent;
          color: var(--primary-text-color);
          min-height: 38px;
          padding: 0 12px;
          cursor: pointer;
        }
        .error {
          border-radius: 10px;
          border: 1px solid var(--error-color);
          color: var(--error-color);
          background: color-mix(in srgb, var(--error-color) 10%, transparent);
          padding: 10px;
          white-space: pre-wrap;
          font-size: 13px;
        }
        @media (max-width: 800px) {
          .item-row {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      </style>
      <div class="wrapper">
        <div class="field">
          <label class="label" for="metering-point">Metering point number</label>
          <input
            id="metering-point"
            class="input"
            data-field="metering_point_number"
            type="text"
            value="${escapeHtml(this._state.meteringPointNumber || "")}"
          />
          <div class="hint">
            Leave empty to auto-discover when exactly one Fortum metering point exists.
          </div>
        </div>

        <div class="field">
          <div class="row">
            <input
              id="debug"
              class="checkbox"
              type="checkbox"
              data-field="debug"
              ${this._state.debug ? "checked" : ""}
            />
            <label for="debug">Enable debug logs for dashboard cards</label>
          </div>
        </div>

        <div class="field">
          <div class="mode-option">
            <input
              id="itemization-source-energy"
              class="checkbox"
              type="radio"
              name="itemization-source"
              data-field="itemization_mode"
              data-value="energy"
              ${this._state.hasExplicitItemization ? "" : "checked"}
            />
            <label for="itemization-source-energy">Use Energy dashboard itemization</label>
          </div>
          ${
            this._state.hasExplicitItemization
              ? ""
              : `<div class="hint">Manage itemizations in Energy settings. <a href="/config/energy/electricity?historyBack=1">Open Energy settings</a>.</div>`
          }
          <div class="mode-option">
            <input
              id="itemization-source-manual"
              class="checkbox"
              type="radio"
              name="itemization-source"
              data-field="itemization_mode"
              data-value="manual"
              ${this._state.hasExplicitItemization ? "checked" : ""}
            />
            <label for="itemization-source-manual">Specify itemizations manually</label>
          </div>
        </div>

        ${
          this._state.hasExplicitItemization
            ? `<div class="itemization">
            ${
              hasStatisticPicker
                ? ""
                : `<div class="hint">Statistic picker is unavailable here. Enter statistic IDs manually.</div>`
            }
            ${rowsHtml}
            <div class="actions">
              <button type="button" data-action="add-item">Add itemization row</button>
            </div>
          </div>`
            : ""
        }

        ${this._error ? `<div class="error">${escapeHtml(this._error)}</div>` : ""}
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    if (!this.shadowRoot) {
      return;
    }

    this.shadowRoot.querySelectorAll("input[data-field]").forEach((input) => {
      input.addEventListener("change", (event) => {
        this._handleFieldChange(event);
      });
    });

    this._applyStatisticPickerProps();

    this.shadowRoot.querySelectorAll("button[data-action]").forEach((button) => {
      button.addEventListener("click", (event) => {
        this._handleAction(event);
      });
    });
  }

  _buildExcludeStatistics(currentIndex) {
    if (!this._state || !Array.isArray(this._state.itemizationRows)) {
      return [];
    }
    return this._state.itemizationRows
      .map((row, index) =>
        index === currentIndex || typeof row?.stat !== "string" ? "" : row.stat.trim()
      )
      .filter(Boolean);
  }

  _applyStatisticPickerProps() {
    if (!this.shadowRoot || !this._state) {
      return;
    }

    this.shadowRoot
      .querySelectorAll("ha-statistic-picker[data-field='stat']")
      .forEach((picker) => {
        picker.allowCustomEntity = true;
        picker.statisticTypes = "sum";
        picker.includeUnitClass = ["energy"];
        if (this._hass) {
          picker.hass = this._hass;
        }
        const index = Number(picker.dataset.index);
        const row = Number.isInteger(index) ? this._state.itemizationRows[index] : undefined;
        picker.value = row?.stat || "";
        picker.excludeStatistics = this._buildExcludeStatistics(index);
        if (!picker.dataset.boundValueChanged) {
          picker.dataset.boundValueChanged = "1";
          picker.addEventListener("value-changed", (event) => {
            this._handleStatisticPickerChange(event);
          });
        }
      });
  }

  _maybeEnsureStatisticPickerLoaded() {
    if (this._statisticPickerAvailable || customElements.get("ha-statistic-picker")) {
      this._statisticPickerAvailable = true;
      return;
    }
    if (this._ensureStatisticPickerPromise || !this._hass || !this.shadowRoot || !this.isConnected) {
      return;
    }
    this._ensureStatisticPickerPromise = this._ensureStatisticPickerLoaded().finally(() => {
      this._ensureStatisticPickerPromise = undefined;
    });
  }

  async _ensureStatisticPickerLoaded() {
    const haSelectorTag = "ha-selector";
    if (!customElements.get(haSelectorTag)) {
      return;
    }

    const probe = document.createElement(haSelectorTag);
    probe.hass = this._hass;
    probe.selector = { statistic: {} };
    probe.style.display = "none";
    this.shadowRoot.appendChild(probe);

    try {
      await Promise.race([
        customElements.whenDefined("ha-statistic-picker"),
        new Promise((resolve) => window.setTimeout(resolve, 1200)),
      ]);
    } finally {
      probe.remove();
      this._statisticPickerAvailable = Boolean(customElements.get("ha-statistic-picker"));
      this._render();
    }
  }

  _handleStatisticPickerChange(event) {
    if (!this._state) {
      return;
    }
    const target = event.currentTarget;
    const index = Number(target?.dataset?.index);
    if (!Number.isInteger(index) || index < 0 || index >= this._state.itemizationRows.length) {
      return;
    }
    const value = event?.detail?.value;
    this._state.itemizationRows[index] = {
      ...this._state.itemizationRows[index],
      stat: typeof value === "string" ? value : "",
    };
    this._validateAndEmit();
  }

  _handleFieldChange(event) {
    if (!this._state) {
      return;
    }
    const target = event.currentTarget;
    const field = target?.dataset?.field;

    if (field === "metering_point_number") {
      this._state.meteringPointNumber = target.value;
      this._validateAndEmit();
      return;
    }

    if (field === "debug") {
      this._state.debug = target.checked;
      this._validateAndEmit();
      return;
    }

    if (field === "itemization_mode") {
      this._state.hasExplicitItemization = target.dataset.value === "manual";
      if (this._state.hasExplicitItemization && this._state.itemizationRows.length === 0) {
        this._state.itemizationRows = [{ stat: "", name: "" }];
      }
      this._validateAndEmit();
      return;
    }

    if (field === "stat" || field === "name") {
      const index = Number(target.dataset.index);
      if (!Number.isInteger(index) || index < 0 || index >= this._state.itemizationRows.length) {
        return;
      }
      this._state.itemizationRows[index] = {
        ...this._state.itemizationRows[index],
        [field]: target.value,
      };
      this._validateAndEmit();
    }
  }

  _handleAction(event) {
    if (!this._state) {
      return;
    }
    const target = event.currentTarget;
    const action = target?.dataset?.action;

    if (action === "add-item") {
      this._state.itemizationRows = this._state.itemizationRows.concat({ stat: "", name: "" });
      this._validateAndEmit();
      return;
    }

    if (action === "remove-item") {
      const index = Number(target.dataset.index);
      if (!Number.isInteger(index) || index < 0 || index >= this._state.itemizationRows.length) {
        return;
      }
      this._state.itemizationRows = this._state.itemizationRows.filter((_, idx) => idx !== index);
      this._validateAndEmit();
    }
  }

  _validateAndEmit() {
    try {
      const config = buildSingleConfigFromEditorState(this._state);
      const validated = validateSingleStrategyConfig(config);
      this._error = "";
      emitConfigChanged(this, validated);
    } catch (err) {
      this._error = err && err.message ? err.message : String(err);
    }

    this._render();
  }
}

if (typeof customElements !== "undefined") {
  const tag = "fortum-energy-single-strategy-editor";
  if (!customElements.get(tag)) {
    customElements.define(tag, FortumEnergySingleStrategyEditor);
  }
}
