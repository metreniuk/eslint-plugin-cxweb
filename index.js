"use strict"

const allRules = {
  "map-dispatch-to-props": require("./lib/rules/map-dispatch-to-props"),
  // "map-state-to-props": require("./lib/rules/map-state-to-props"),
  "no-unused-action": require("./lib/rules/no-unused-action"),
}

module.exports = {
  rules: allRules,
}
