export function maskPhone(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Limit to 11 digits and remove formatting
  return numbers.slice(0, 11);
}