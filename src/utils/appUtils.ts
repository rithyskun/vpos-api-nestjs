export function formatDateTime(d: Date) {
  return new Date(d).toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: 'numeric',
  });
}
