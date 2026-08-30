/**
 * Central application configuration. Import this instead of reading
 * `process.env` directly throughout the application.
 *
 * NEXT_PUBLIC_* variables intentionally use literal property access because
 * Next.js replaces those expressions statically in client bundles.
 */
export const config = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "https://yash14.com",
  },

  registry: {
    namespace: process.env.NEXT_PUBLIC_REGISTRY_NAMESPACE || "@yash14",
    namespaceUrl:
      process.env.NEXT_PUBLIC_REGISTRY_NAMESPACE_URL ||
      "https://yash14.com/r/{name}.json",
  },

  github: {
    apiToken: process.env.GITHUB_API_TOKEN,
    contributionsApiUrl:
      process.env.GITHUB_CONTRIBUTIONS_API_URL ||
      "https://github-contributions-api.jogruber.de",
    actionsCommitSha: process.env.GITHUB_SHA,
  },

  dmca: {
    url:
      process.env.NEXT_PUBLIC_DMCA_URL ||
      "https://www.dmca.com/ProtectionPro.aspx",
  },

  analytics: {
    posthogProjectToken: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },

  openPanel: {
    publicClientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
    projectId: process.env.OPENPANEL_PROJECT_ID,
    clientId: process.env.OPENPANEL_CLIENT_ID,
    clientSecret: process.env.OPENPANEL_CLIENT_SECRET,
  },

  build: {
    commitSha: process.env.BUILD_GIT_COMMIT_SHA,
    vercelCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
    deployedAt: process.env.VERCEL_DEPLOYMENT_CREATED_AT,
  },

  runtime: {
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === "production",
  },
} as const;
