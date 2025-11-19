// test/setup-platform-express.js
// Load .env if available, but set sane defaults for tests.
try{
  require('reflect-metadata');
} catch (e) {
  // if reflect-metadata is not installed, it will still work if your app already loads it,
  // but it's safe to install reflect-metadata if you hit errors:
  // npm install reflect-metadata --save

}
try {
  // try to load dotenv if present (will be no-op if not installed)
  try {
    require('dotenv').config({ path: '.env.test' });
  } catch (e) {
    // ignore if dotenv is not installed
  }

  // Minimal required env defaults for tests
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_please_change';
  // If you use JWT_EXPIRES_IN or other auth envs, set them too:
  // process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3600s';

  // If your tests interact with Prisma/DB, you probably need DATABASE_URL:
  // set to an sqlite file-based db in your repo for quick local runs (or point at your test DB)
  process.env.DATABASE_URL = process.env.DATABASE_URL || `file:./dev-test.db`;

  // Force-load platform-express early in each Jest worker
  require('@nestjs/platform-express');
  require('@nestjs/common');
} catch (e) {
  // Print full stack to help debug
  // eslint-disable-next-line no-console
  console.error('Failed to setup test env / require @nestjs/platform-express:', e && e.stack ? e.stack : e);
  throw e;
}
