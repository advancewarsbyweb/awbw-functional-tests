module.exports = {
  e2e: {
    testIsolation: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // in plugins file
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
};
