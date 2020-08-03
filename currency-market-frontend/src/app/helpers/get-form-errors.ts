export function getFormErrors(error: object): string {
  return Object.keys(error)[0];
}
