// The one place CSP lives. CSP_META goes into index.html at build time; CSP_HEADERS
// feeds public/_headers and vercel.json, and `npm run check:headers` fails if a copy
// drifts. frame-ancestors is header-only - a meta tag silently ignores it.
//
// `trusted-types default` + `require-trusted-types-for 'script'` send every DOM XSS
// sink (innerHTML, insertAdjacentHTML, eval, script src, ...) through a TrustedHTML /
// TrustedScript object instead of a raw string.

const DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self'",
  // React writes inline style values through CSSOM (node.style), which CSP does
  // not block - only <style> tags and markup style attributes are, and we ship
  // neither (dev is excluded, build emits a linked stylesheet).
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "manifest-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "frame-src 'none'",
  "media-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
  "require-trusted-types-for 'script'",
  "trusted-types default",
];

export const CSP_META = DIRECTIVES.join("; ");

export const CSP_HEADERS = [...DIRECTIVES, "frame-ancestors 'none'"].join("; ");

export const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "browsing-topics=()",
      "camera=()",
      "display-capture=()",
      "geolocation=()",
      "gyroscope=()",
      "interest-cohort=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "picture-in-picture=()",
      "screen-wake-lock=()",
      "usb=()",
      "web-share=()",
      "xr-spatial-tracking=()",
    ].join(", "),
  },
  { key: "Content-Security-Policy", value: CSP_HEADERS },
];
