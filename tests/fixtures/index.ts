import fs from 'node:fs';
import path from 'node:path';

export interface SetupData {
  TestURL: string;
  MapOnePrefsId: string;
}

export interface AccountData {
  StandardAccount: string;
  StandardAccountPass: string;
}

/**
 * setup-data.json ships with the repo (TestURL + map prefs id) and is always
 * safe to load eagerly, including from playwright.config.ts.
 */
export const setupData: SetupData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'setup-data.json'), 'utf8')
);

/**
 * Reads the gitignored, user-local account fixture. Call this lazily from
 * test.beforeAll (NOT at module import time) so that `playwright test --list`
 * and the no-auth smoke spec keep working before a contributor has set up an
 * account. Throws a clear, actionable error if the file is missing.
 */
export function loadAccountData(): AccountData {
  const accountPath = path.join(__dirname, 'personal-automation-account.json');
  try {
    return JSON.parse(fs.readFileSync(accountPath, 'utf8'));
  } catch {
    throw new Error(
      `Could not read ${accountPath}. Run \`./environment-setup.sh\` and fill in a ` +
        'throwaway AWBW account before running the auth-dependent specs. NEVER use an ' +
        'account you care about for test automation.'
    );
  }
}
