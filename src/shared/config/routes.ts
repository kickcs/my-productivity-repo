export const routes = {
  home: "/",
  history: "/history",
  analytics: "/analytics",
  settings: "/settings",
  rate: (date: string) => `/rate/${date}`,
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;
