import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * baseURL defaults to the value in tests/fixtures/setup-data.json (TestURL),
 * and can be overridden point-in-time at a local instance with AWBW_TEST_URL.
 * Read directly from disk so importing this config never requires the
 * (gitignored, user-local) account fixture to exist.
 */
const setupData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'tests', 'fixtures', 'setup-data.json'), 'utf8')
);

const baseURL = process.env.AWBW_TEST_URL ?? setupData.TestURL;

/**
 * Playwright runs each test file in a fresh browser context by default, which
 * mirrors the previous Cypress testIsolation behaviour (fresh login per test).
 * fullyParallel is disabled because the gameplay specs are stateful and share
 * a single automation account against the live site.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
