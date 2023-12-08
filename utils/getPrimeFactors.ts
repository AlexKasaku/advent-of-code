// Check if the divisor is a prime number. If using this multiple times you might
// want to build a map once and then refer to that.
const isPrime = (number: number) => {
  for (let j = 2; j <= number / 2; j++) {
    if (number % j === 0) return false;
  }
  return true;
};

export const getPrimeFactors = (number: number) => {
  const primeArray = [];

  // Find divisors starting with 2
  for (let divisor = 2; divisor <= number; divisor++) {
    if (number % divisor !== 0) continue;

    const divisorIsPrime = isPrime(divisor);
    if (!divisorIsPrime) continue;

    // If the divisor is prime, divide integer with the number and store
    number /= divisor;
    primeArray.push(divisor);
  }

  return primeArray;
};
