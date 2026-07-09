export const appUrl =
  import.meta.env.VITE_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");

export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
