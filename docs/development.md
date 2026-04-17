# Development Notes

This document contains contributor-focused architecture and development notes for the Fortum integration.

For sanitized API request/response examples referenced by this integration, see `docs/fortum-api.md`.

## Project Structure

```
custom_components/fortum/
├── __init__.py              # Integration setup and teardown
├── api/                     # API client modules
│   ├── __init__.py
│   ├── auth.py              # OAuth2 authentication client
│   ├── client.py            # Main API/statistics client
│   └── endpoints.py         # API endpoint definitions
├── sensors/                 # Sensor entity modules
│   ├── __init__.py
│   ├── metering_point.py    # Per-metering-point diagnostic sensor
│   ├── price.py             # Near-real-time price sensor
│   ├── stats_last_sync.py   # Integration-wide statistics last-sync sensor
│   └── tomorrow_price.py    # Tomorrow max price + timestamp sensors
├── coordinators/            # Data update coordinators
│   ├── __init__.py
│   ├── hourly_consumption.py
│   └── spot_price.py
├── button.py                # Debug button entities
├── config_flow.py           # Configuration flow and options
├── const.py                 # Constants and configuration
├── device.py                # Device representation
├── entity.py                # Base entity class
├── exceptions.py            # Custom exceptions
├── models.py                # Data models
├── sensor.py                # Sensor platform setup
├── manifest.json            # Integration manifest
├── strings.json             # UI strings
└── translations/            # Localization files
```

## Architecture Notes

### OAuth2 Authentication (`api/auth.py`)
- Handles Fortum SSO login flow.
- Manages token lifecycle and refresh.
- Uses retry/backoff when session user data has not propagated yet.

### API + Statistics Client (`api/client.py`)
- Handles authenticated API calls and retry/error handling.
- Imports hourly external statistics per metering point.
- Maintains cumulative `sum` for hourly consumption/cost statistics.
- Writes area-scoped `fortum:price_forecast_<area>` statistics from fetched spot-price windows.
- Requires explicit `priceArea` values from Fortum session payload for spot-price fetches (no region fallback).
- Uses a 14-day recent window and 14-day chunks for historical catch-up.
- Fortum API can return GraphQL errors or take over 30 seconds for larger windows (observed even around 30 days).
- Uses `price` as the canonical hourly core-metric existence marker (`energy`/`cost`/`price` import and comparison scope).
- Fortum may still provide `temperatureReading` when core metrics are missing (`energy: []`, `cost: null`, `price: null`).

### Token and Session Handling (`api/auth.py`, `api/client.py`, `coordinators/*`)

The integration supports two authentication modes and handles them differently:

- **Session-based mode** (`refresh_token == "session_based"`):
  - Auth is maintained through Fortum session flow (cookies + session payload).
  - There is no usable OAuth refresh-token exchange.
  - Scheduler skips refresh exchange attempts and goes directly to re-authentication when renewal is due.

- **OAuth refresh-token mode**:
  - Uses token exchange endpoint to refresh access tokens.
  - Scheduler attempts proactive refresh before expiry, then re-authenticates if refresh cannot recover.

#### Proactive renewal scheduler (`OAuth2AuthClient`)

After successful authentication, the client starts a one-shot scheduler:

- Next renewal is scheduled at: `ttl - max(15s, 10% of ttl)`.
- Scheduler behavior:
  1. Try token refresh (when mode supports it).
  2. On refresh failure, retry with exponential backoff (`5s`, `10s`, `20s`, ...).
  3. Stop refresh retries when token expires, or immediately switch on refresh `401`.
  4. Enter re-auth stage and retry authentication with exponential backoff capped at **30 minutes**.

Notes:
- Scheduler is stopped on integration unload (`async_unload_entry`) to avoid orphan background tasks.
- Internal method names use "renewal scheduler" terminology to match behavior.

#### Request handling and auth failures (`FortumAPIClient._get`)

- `_get` retries all request failures with a unified policy: **3 total attempts** with **5s** and **10s** backoff delays.
- Retry logs are warning-level; terminal diagnostics are logged once on the final failed attempt (includes URL and exception details).
- HTTP `401` is treated as authentication failure and raised as `AuthenticationError` on the final failed attempt after `_get` retries.
- Other API/transport errors are raised as `APIError` (or wrapped as API error).

#### API logging behavior (`api/client.py`)

- `_handle_response` focuses on response parsing and exception mapping; it avoids per-attempt noisy status/error logging.
- `_get` is the single place for retry/final-failure request logs, so callers do not need duplicate terminal error logs.

#### HA signaling boundary (`coordinators/*`)

Home Assistant auth-state signaling is done in coordinators:

- `AuthenticationError` -> `ConfigEntryAuthFailed` (triggers reauth flow in HA UI).
- `APIError` and other transient failures -> `UpdateFailed`.

This keeps:
- auth/session recovery logic in auth layer,
- HA state signaling in coordinator/update layer.

### Coordinators (`coordinators/*`)
- Main coordinator runs statistics sync cycle.
- Price coordinator updates near-real-time spot prices.
- Both coordinators map failures consistently:
  - `AuthenticationError` -> `ConfigEntryAuthFailed`
  - `APIError` -> `UpdateFailed`

### Sensors (`sensors/*`)
- `Statistics Last Sync` is a diagnostic sensor created for each integration entry.
- `Tomorrow Max Price` and `Tomorrow Max Price Time` are based on tomorrow points in spot-price coordinator data and remain unavailable until tomorrow prices are published.
- Spot-price sensors are created per area (`[AREA]` notation in entity names, area code suffix in unique IDs) and legacy non-area spot entities are removed by migration.

### Models (`models.py`)
- Typed models for API payloads.
- Parsing helpers for metering point and time-series payload variants.

## TODO

- Persist pending historical sync per metering point across statistics sync failures (when existing statistics are missing), retry those points on subsequent sync cycles, and clear each pending state only after that metering point completes a successful historical sync.

## Development

### Setup

```bash
uv sync
uv run pre-commit install
```

### Checks

```bash
uv run ruff check custom_components/fortum tests
uv run pytest
```

### Targeted checks

```bash
uv run pytest tests/unit
uv run pytest tests/integration
```

### Frontend compatibility canary (local)

Some dashboard editors depend on Home Assistant frontend internals (for example
`ha-statistic-picker` behavior). To run an optional compatibility canary against
the latest HA frontend release:

```bash
./scripts/sync-ha-frontend.sh
node --test tests/frontend/test_ha_frontend_compat.cjs
```

Or run the one-shot helper that updates the cached clone first and then runs the
compatibility tests:

```bash
./scripts/test-ha-frontend-compat.sh
```

Notes:
- The clone is cached in git-ignored `ha-frontend/`.
- The tracked file `ha-frontend-release.json` records the currently pinned
  HA frontend release tag + commit used for compatibility checks.
- The sync script keeps the clone between runs and updates tags before checking
  out the latest release tag, then refreshes `ha-frontend-release.json`.
- The compatibility tests auto-skip when `ha-frontend/home-assistant-frontend`
  is not present.
- `test-ha-frontend-compat.sh` exits successfully (skip) when the clone is not
  present, and runs `sync-ha-frontend.sh` first when it is present.
- On release metadata changes (`manifest.json` or `hacs.json`), pre-commit runs
  `scripts/release-trigger-checks.sh`, which updates HA frontend marker/clone
  first and then runs full backend and frontend tests.

### Live E2E test (manual)

```bash
FORTUM_E2E=1 \
FORTUM_USERNAME="your_username" \
FORTUM_PASSWORD="your_password" \
FORTUM_REGION="fi" \
uv run pytest tests/e2e/test_live_api.py -v
```

Notes:
- This test is opt-in and skipped unless `FORTUM_E2E=1` is set.
- It performs real authentication and API calls.
- Avoid running it in CI unless secrets are configured.

## Troubleshooting

### Debug logging

```yaml
logger:
  default: info
  logs:
    custom_components.fortum: debug
```

Config-entry diagnostics downloads include runtime metadata such as Home Assistant
version and integration version, alongside redacted recent integration logs.

### Common issues

1. Authentication failure: verify Fortum credentials and region.
2. Missing history: verify metering point has available data for the requested period.
3. Network issues: verify Home Assistant can reach Fortum endpoints.
