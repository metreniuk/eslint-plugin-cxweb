/**
 * @fileoverview prefer object literal
 * @author Alexandr Metreniuc
 */
"use strict"

const { dot, hasName } = require("../utils")

module.exports = {
  meta: {
    docs: {
      description: "prefer object literal",
      category: "Fill me in",
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    return {
      Identifier(node) {
        if (!hasName("mapDispatchToProps", node)) {
          return
        }

        const { parent } = node

        const varDeclaratorLength = dot("init.params.length", parent)
        const funcLength = dot("params.length", parent)

        if (varDeclaratorLength === 1 || funcLength === 1) {
          context.report({
            message: "mapDispatchToProps should be an object literal",
            node,
          })
        }
      },
    }
  },
}
