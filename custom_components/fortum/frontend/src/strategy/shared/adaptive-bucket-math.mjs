export const computeTotalAndUntrackedByBucket = ({
  usedTotalByMathBucket,
  deviceTotalsByMathBucket,
  bucketMs,
  flowBucketMs,
}) => {
  const totalConsumedByBucket = new Map();
  const untrackedByBucket = new Map();
  const sortedMathBuckets = Array.from(
    new Set([
      ...Array.from((usedTotalByMathBucket || new Map()).keys()),
      ...Array.from((deviceTotalsByMathBucket || new Map()).keys()),
    ])
  ).sort((a, b) => a - b);

  sortedMathBuckets.forEach((ts) => {
    const hasTotal = usedTotalByMathBucket.has(ts);
    const usedTotal = usedTotalByMathBucket.get(ts) || 0;
    const deviceTotal = deviceTotalsByMathBucket.get(ts) || 0;
    const untracked = hasTotal ? usedTotal - deviceTotal : 0;

    if (!hasTotal) {
      totalConsumedByBucket.set(ts, 0);
      untrackedByBucket.set(ts, 0);
      return;
    }

    if (bucketMs < flowBucketMs) {
      totalConsumedByBucket.set(ts, (totalConsumedByBucket.get(ts) || 0) + usedTotal);
      untrackedByBucket.set(ts, (untrackedByBucket.get(ts) || 0) + untracked);
      return;
    }

    totalConsumedByBucket.set(ts, (totalConsumedByBucket.get(ts) || 0) + usedTotal);
    untrackedByBucket.set(ts, (untrackedByBucket.get(ts) || 0) + untracked);
  });

  return {
    totalConsumedByBucket,
    untrackedByBucket,
  };
};
