# Welcome

This is the repo for the E2E automation tests for AWBW!

# Installation Steps:

Note for Windows users: Everything in this setup is done inside WSL. A non-wsl environment might already have everything installed.

1. Open a terminal, likely in your IDE of choice. Make sure you have Node and NPM installed on your machine. Note that you might have to run `apt-get update`, `apt install node` and `apt install npm` if you don't have them.

2. Run `npm install`

3. Install the Playwright browser binaries and (on Linux) their system dependencies:

```
npx playwright install
npx playwright install-deps
```

`npx playwright install-deps` uses `apt` under the hood, so on WSL you may need `sudo`. Native linux users can usually skip `install-deps`.

4. Run `./environment-setup.sh` to create a throwaway automation account file. Set all variables in
   tests/fixtures/personal-automation-account.json to a throwaway automation account. Create one if you
   don't already have one!

5. Run `npx playwright test` to run the tests headlessly. To get the interactive UI mode (great for
   writing and debugging tests), run `npx playwright test --ui`. To watch them run in a visible browser,
   run `npx playwright test --headed`.

If you are a beginner, please reach out to soul4rent if you are having any issues!

---

# Want to contribute?

Please read the CONTRIBUTIONS.md file before contributing! All skill levels are welcome to help out!
