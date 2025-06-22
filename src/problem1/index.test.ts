import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./solution";

describe("Sum to n functions", () => {
  // Test cases for all implementations
  const testCases = [
    { n: 1, expected: 1 },
    { n: 5, expected: 15 },
    { n: 10, expected: 55 },
    { n: 100, expected: 5050 },
    { n: 0, expected: 0 },
  ];

  // Test implementation A: Iterative approach
  describe("sum_to_n_a (Iterative approach)", () => {
    test.each(testCases)(
      "sum_to_n_a($n) should return $expected",
      ({ n, expected }) => {
        expect(sum_to_n_a(n)).toBe(expected);
      }
    );

    test("should handle negative numbers by returning 0", () => {
      expect(sum_to_n_a(-5)).toBe(0);
    });

    test("should handle large inputs efficiently", () => {
      const start = performance.now();
      sum_to_n_a(10000);
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });
  });

  // Test implementation B: Mathematical formula approach
  describe("sum_to_n_b (Mathematical formula approach)", () => {
    test.each(testCases)(
      "sum_to_n_b($n) should return $expected",
      ({ n, expected }) => {
        expect(sum_to_n_b(n)).toBe(expected);
      }
    );

    test("should handle negative numbers correctly", () => {
      expect(sum_to_n_b(-5)).toBe(0);
    });

    test("should be more efficient than iterative for large numbers", () => {
      const n = 1000000;

      const startA = performance.now();
      sum_to_n_a(n);
      const endA = performance.now();

      const startB = performance.now();
      sum_to_n_b(n);
      const endB = performance.now();

      expect(endB - startB).toBeLessThan(endA - startA);
    });
  });

  // Test implementation C: Recursive approach
  describe("sum_to_n_c (Recursive approach)", () => {
    test.each(testCases)(
      "sum_to_n_c($n) should return $expected",
      ({ n, expected }) => {
        expect(sum_to_n_c(n)).toBe(expected);
      }
    );

    test("should handle negative numbers by returning 0", () => {
      expect(sum_to_n_c(-5)).toBe(0);
    });

    test("should handle moderate sized inputs without stack overflow", () => {
      expect(() => sum_to_n_c(999)).not.toThrow();
    });

    test("should produce same result as other implementations", () => {
      const n = 50;
      const resultA = sum_to_n_a(n);
      const resultB = sum_to_n_b(n);
      const resultC = sum_to_n_c(n);

      expect(resultC).toBe(resultA);
      expect(resultC).toBe(resultB);
    });
  });

  // Compare all implementations
  describe("Comparison of all implementations", () => {
    test("all implementations should produce the same results", () => {
      for (let i = 0; i <= 20; i++) {
        const resultA = sum_to_n_a(i);
        const resultB = sum_to_n_b(i);
        const resultC = sum_to_n_c(i);

        expect(resultA).toBe(resultB);
        expect(resultB).toBe(resultC);
      }
    });
  });
});
