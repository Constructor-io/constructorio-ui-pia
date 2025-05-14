export function isHexColor(hex?: string) {
  return (
    typeof hex === 'string' && hex.length === 7 && !Number.isNaN(Number(`0x${hex.substring(1)}`))
  );
}

export function getPreferredColorScheme() {
  let colorScheme = 'light';
  // Check if the dark-mode Media-Query matches
  if (window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
    colorScheme = 'dark';
  }
  return colorScheme;
}
