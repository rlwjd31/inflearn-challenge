import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    // @FIXME: cannot load DATEBASE_URL from .env file
    url: env('DATABASE_URL'),
  },
});
