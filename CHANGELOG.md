# Changelog

All notable changes to this project are documented in this file.

## [4.1.0]

### Changed
- Spot-price and tomorrow-price data are now area-scoped: entities and forecast statistics include region/area suffixes (for example `fortum:price_forecast_<area>`), and the tomorrow-price card renders multiple areas on one card.
- Spot-price fetch now requires explicit `priceArea` values from Fortum session data (no region fallback behavior).
- Dashboard forecast discovery now uses Recorder statistic id listing and accepts only area-scoped forecast ids.
- Documentation and README were updated for area-scoped behavior, dashboard debugging, and plain Markdown images.

## [4.0.1]

### Changed
- Improved authentication and session handling across regions (including Norway), with more resilient SSO flow behavior and cleaner failure handling.
- Improved integration architecture and reliability, including setup-path simplifications and safer startup behavior.
- Improved logging and diagnostics: added function-name log context, reduced noise, and improved diagnostics export/troubleshooting support.
- Improved long-term stability of entities/devices by migrating identity handling to config-entry-based IDs to avoid duplicate/orphaned entities across restarts.
- Improved dashboard UX and maintainability: better card/source behavior, clearer labels/errors, and stronger runtime config/test coverage.
- Improved developer quality gates and docs organization to keep releases more predictable.

## [4.0.0]

### Changed
- Major release after repository separation.
