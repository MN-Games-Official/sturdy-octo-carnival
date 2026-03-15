export const APP_NAME = 'Polaris Pilot';
export const APP_VERSION = '1.0.0';

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

export const TOKEN_EXPIRY = {
  ACCESS: '24h',
  REFRESH: '30d',
  EMAIL_VERIFY: 6 * 60 * 60 * 1000, // 6 hours in ms
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour in ms
};

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  SHORT_ANSWER: 'short_answer',
  TRUE_FALSE: 'true_false',
} as const;

export const MAX_SHORT_ANSWERS = 3;

export const API_KEY_TYPES = {
  ROBLOX: 'roblox',
  POLARIS: 'polaris',
} as const;

export const COLORS = {
  PRIMARY: '#ff4b6e',
  SECONDARY: '#1f2933',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  APPLICATIONS: '/application-center',
  RANK_CENTERS: '/rank-center',
  API_KEYS: '/api-keys',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Application Center', href: '/application-center', icon: 'FileText' },
  { label: 'Rank Center', href: '/rank-center', icon: 'Award' },
  { label: 'API Keys', href: '/api-keys', icon: 'Key' },
  { label: 'Profile', href: '/profile', icon: 'User' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
];
