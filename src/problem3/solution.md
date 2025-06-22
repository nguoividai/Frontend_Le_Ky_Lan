# Solution for Problem 3: Code Refactoring Analysis

## Inefficiencies and Anti-patterns in the Original Code

### 1. Type Definition Issues

- **Missing Property Type**: The `WalletBalance` interface was missing the `blockchain` property that was being used throughout the code.
- **Using `any` Type**: The `getPriority` function used `any` for the blockchain parameter, losing type safety.

### 2. Component Structure Issues

- **Function Definition Inside Component**: The `getPriority` function was defined inside the component, causing it to be recreated on every render.
- **Prop Destructuring**: Unnecessarily complex prop destructuring, especially since `children` wasn't being used.

### 3. Performance Issues

- **Incorrect Dependency Array**: The `useMemo` for sortedBalances included `prices` in the dependency array when it wasn't being used in the calculation.
- **Missing Memoization**: `formattedBalances` wasn't memoized, causing unnecessary recalculations.
- **Multiple Mapping Operations**: Using `sortedBalances` to create both `formattedBalances` and `rows` instead of chaining efficiently.

### 4. Logic Errors

- **Incorrect Filter Logic**: The filter logic was inverted, keeping balances with amount <= 0 instead of > 0.
- **Incomplete Sort Function**: The sort function didn't handle the case where priorities are equal.
- **Unsafe Price Calculation**: No null check when accessing `prices[balance.currency]`.

### 5. React Best Practices Violations

- **Using Index as Key**: Using array index as React key in the list, which is an anti-pattern.

## Refactored Solution

```tsx
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // ➤ Updated to include blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // ➤ Filter logic corrected and sort function simplified
  const sortedBalances = useMemo(() => {
    return balances
      .filter(
        (balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0
      )
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
  }, [balances]); // ➤ Removed prices from dependency array since it's not used

  // ➤ Added memoization for formattedBalances
  const formattedBalances: FormattedWalletBalance[] = useMemo(
    () =>
      sortedBalances.map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      })),
    [sortedBalances]
  );

  // ➤ Added null check for prices and used formattedBalances instead of sortedBalances
  const rows = formattedBalances.map((balance) => {
    const price = prices[balance.currency];
    const usdValue = price ? price * balance.amount : 0;

    return (
      <WalletRow
        className={classes.row}
        key={balance.currency} // ➤ Using currency as key instead of index for stability
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
```

## Explanation of Improvements

### 1. Moved `getPriority` Outside Component

- **Before**: Function redefined on every render
- **After**: Defined once outside component
- **Benefit**: Better performance and memory usage

### 2. Fixed Type Definitions

- **Before**: Missing `blockchain` property in interface
- **After**: Added proper type definition
- **Benefit**: Type safety, better IDE support, fewer runtime errors

### 3. Simplified and Fixed Filter Logic

- **Before**: Incorrect condition that kept balances with amount <= 0
- **After**: Clear, direct condition checking for amount > 0
- **Benefit**: Correct filtering behavior

### 4. Improved Sorting Logic

- **Before**: Complex if-else, missing case when priorities are equal
- **After**: Used simple numeric subtraction for sorting
- **Benefit**: Concise, handles all cases correctly

### 5. Fixed Dependency Arrays

- **Before**: Included unnecessary `prices` in dependency array
- **After**: Only included dependencies that are actually used
- **Benefit**: Prevents unnecessary recalculations

### 6. Added Missing Memoization

- **Before**: `formattedBalances` not memoized
- **After**: Used `useMemo` for `formattedBalances`
- **Benefit**: Prevents unnecessary recalculations

### 7. Added Null Check for Prices

- **Before**: No safe check when accessing price by currency
- **After**: Used conditional check with fallback to 0
- **Benefit**: Prevents potential runtime errors

### 8. Used Better React Keys

- **Before**: Used array index as key
- **After**: Used currency (unique identifier) as key
- **Benefit**: Better React reconciliation and fewer potential issues with list updates

### 9. Used Proper TypeScript Features

- **Before**: Excessive type annotations, `any` type usage
- **After**: Type inference where appropriate, specific types where needed
- **Benefit**: Cleaner code with better type safety
