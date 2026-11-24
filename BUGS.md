# Known Bugs

## Thin bars in views that include a DST transition

### Symptom

In the Fortum dashboard adaptive graph, every bar in a view becomes only a
few pixels wide when the selected range includes a daylight-saving time
transition (summer time start in March or end in October). Views without
a transition render bars at normal width (10+ px for a 31-day range).

Observed: range 2026-10-25 – 2026-11-24 (includes the 2026-10-25 autumn
transition, 25-hour day), 6-hour buckets, chart width 1530 px.

### Cause

`_bucketStart()` in
`custom_components/fortum/frontend/src/strategy/cards/devices-adaptive-graph-card.js`
places sub-day buckets at local midnight plus fixed multiples of
`bucketMs`:

```js
return dayStart + Math.floor((ts - dayStart) / bucketMs) * bucketMs;
```

This assumes every local day is exactly 24 hours long. On transition days
it is not:

- Autumn (25-hour day): with 6-hour buckets the day gets buckets at
  +0, +6, +12, +18 and +24 hours. The fifth one starts at 23:00 local and
  is only 1 hour before the next local midnight bucket.
- Spring (23-hour day): buckets at +6/+12/+18 hours land on 07:00, 13:00
  and 19:00 local instead of 06:00/12:00/18:00, and the last bucket is
  5 hours long.

ECharts sizes bars on a time axis from the smallest gap between data
points, so a single 1-hour gap makes all bars in the view about 1/6 of
the normal width. The spring case shrinks them less (5-hour gap).

The same applies to other sub-day bucket sizes (for example 3-hour
buckets: 1-hour gap in autumn, 2-hour gap in spring). Daily buckets
(`bucketMs >= 24h`) are not affected.

### Evidence

Dashboard debug export `fortum-dashboard-debug-2026-11-24T09-31-57-757Z.json`
(range 2026-10-24T21:00Z – 2026-11-24T21:59Z, `bucket_ms` 21600000):
in `computed.total_consumed_by_bucket`, `device_totals_by_bucket` and
`untracked_by_bucket`, 121 gaps between consecutive buckets are 6 h and
exactly one is 1 h, at 2026-10-25 23:00 local. Ranges in the same export
without a transition (2026-09-23 – 2026-10-24) render normally.
