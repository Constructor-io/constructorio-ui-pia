// Controls serialize args to JSON, which drops functions, so these would show as `{}`.
export const functionArgTypes = {
  callbacks: { control: false },
  componentOverrides: { control: false },
  formatters: { control: false },
  checkoutTriggers: { control: false },
} as const;
