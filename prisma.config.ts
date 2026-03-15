import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? 'mysql://user:password@localhost:3306/polarisone',
  },
});
