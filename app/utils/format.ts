export const formatFloat = (num: number, decimals: number = 2) => {
  return Number.isInteger(num) ? num.toString() : num.toFixed(decimals);
};
