/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emergent preview URLs are proxied through a different host than the
  // dev server binds to. Next.js dev blocks cross-origin _next/* asset
  // requests by default, which prevents client bundles from hydrating.
  // Wildcards match any Emergent preview subdomain.
  allowedDevOrigins: [
    "*.preview.emergentagent.com",
    "*.emergentagent.com",
    "*.preview.emergentcf.cloud",
    "*.emergentcf.cloud",
  ],
};

module.exports = nextConfig;
