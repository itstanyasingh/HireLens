import { describe, it, expect } from 'vitest';
import { runPerformanceProfile } from '../src/services/performanceProfiler';

describe('HireLens Real-Time Performance & SLA Benchmark Suite', () => {
  it('executes all 8 critical engine operations well within SLA latency thresholds', () => {
    const report = runPerformanceProfile();

    console.log(`\n======================================================`);
    console.log(`HIRELENS PERFORMANCE PROFILE BENCHMARK RESULTS`);
    console.log(`Environment: ${report.environment} | Timestamp: ${report.timestamp}`);
    console.log(`Total Pipeline Duration: ${report.totalTimeMs} ms`);
    console.log(`======================================================`);

    for (const m of report.metrics) {
      console.log(`- [${m.status}] ${m.operation}: ${m.executionTimeMs} ms (SLA Limit: ${m.thresholdMs} ms)`);
      expect(m.executionTimeMs).toBeLessThanOrEqual(m.thresholdMs);
    }

    // Overall total time for all 8 operations must be under 1,000 ms
    expect(report.totalTimeMs).toBeLessThan(1000);
  });
});
