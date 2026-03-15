export const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@polarisone.com',
    fromName: process.env.SMTP_FROM_NAME || 'Polaris Pilot',
  },
  roblox: {
    apiBase: process.env.ROBLOX_API_BASE || 'https://apis.roblox.com',
    groupApi: process.env.ROBLOX_GROUP_API || 'https://groups.roblox.com',
  },
  ai: {
    apiKey: process.env.ABACUS_AI_API_KEY,
    baseUrl: process.env.ABACUS_AI_BASE_URL || 'https://routellm.abacus.ai/v1',
    model: process.env.ABACUS_AI_MODEL || 'gemini-3-flash-preview',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://app.example.com',
    apiBase: process.env.NEXT_PUBLIC_API_BASE || '/api',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'default-key-change-in-production!!',
  },
};

export default config;
