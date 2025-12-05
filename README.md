# Welcome

This is the repo for the E2E automation tests for AWBW!

# Installation Steps:

Note for Windows users: Everything in this setup is done inside WSL. A non-wsl environment might already have everything installed.

1. Open a terminal, likely in your IDE of choice. Make sure you have Node and NPM installed on your machine. Note that you might have to run `apt-get update`, `apt install node` and `apt install npm` if you don't have them.

2. Run `npm install`

3. IF IN WSL, run the following:

```
sudo apt install libnss3
sudo apt install libasound2t64
```

This should install all necessary packages to run cypress. Native linux likely has these packages already.

4. Run `npx cypress open` in order to open the cypress electron app. Alternatively, you can run `npx cypress run`
   in order to run the cypress tests headlessly.

Note: If running this for the first time, you might have to run `cypress install` before you are
able to run `npx cypress run` for the first time.

If you are a beginner, please reach out to soul4rent if you are having any issues!

---

# Want to contribute?

Please read the CONTRIBUTIONS.md file before contributing! All skill levels are welcome to help out!
