# Installation Steps:

Note for Windows users: Everything in this setup is done inside WSL, so install and set-up WSL with Ubuntu or Debian before proceeding.

NOTE: You should clone this repo **INSIDE WSL** and then follow these steps.

1) Open a terminal, likely in your IDE of choice. Make sure you have Node and NPM installed on your machine. Note that you might have to run `apt-get update`, `apt install node` and `apt install npm` if you don't have them.

2) Install the cypress prerequisites, see https://docs.cypress.io/app/get-started/install-cypress#Linux-Prerequisites 

3) Run `npm install`

4) Run `npx cypress run` in order to run the cypress tests headlessly.

5) Run `npx cypress open` in order to open the cypress electron app. Note that for WSL you'll need to set-up an X Server to have a display environment or it won't work.

---
