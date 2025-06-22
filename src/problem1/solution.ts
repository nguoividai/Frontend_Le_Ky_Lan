// Implementation 1: Iterative approach using a for loop
export const sum_to_n_a = function (n: number): number {
  let sum = 0;
  if (n <= 0) return 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Implementation 2: Mathematical formula approach
// Sum of first n natural numbers = n*(n+1)/2
export const sum_to_n_b = function (n: number): number {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
};

// Implementation 3: Recursive approach
export const sum_to_n_c = function (n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};
