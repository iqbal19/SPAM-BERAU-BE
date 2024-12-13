export function generateCode(prefix: string, lastNumber: number): string {
  const newNumber = lastNumber + 1;
  const paddedNumber = newNumber.toString().padStart(4, '0');
  return `${prefix}-${paddedNumber}`;
}