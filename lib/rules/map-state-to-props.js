/**
 * @fileoverview prefer structured selector to a function
 * @author Alexandr Metreniuc
 */
"use strict"
const { last } = require("ramda")
const {
  dot,
  hasName,
  isVariableDeclarator,
  isFunctionDeclaration,
  isFunction,
} = require("../utils")

module.exports = {
  meta: {
    docs: {
      description: "prefer structured selector to a function",
      category: "stylistic",
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    return {
      Identifier(node) {
        if (!hasName("mapStateToProps", node)) {
          return
        }

        const { parent } = node

        const varDeclaratorParamsLength = dot("init.params.length", parent)
        const varDeclaratorBody = dot("init.body.body", parent)
        const varDeclaratorBodyLength = dot("length", varDeclaratorBody)

        if (
          isVariableDeclarator(parent) &&
          (varDeclaratorParamsLength !== 1 || varDeclaratorBodyLength !== 1)
        ) {
          return
        }

        const funcLength = dot("params.length", parent)
        const funcBody = dot("body.body", parent)
        const funcBodyLength = dot("length", funcBody)
        if (
          isFunctionDeclaration(parent) &&
          (funcLength !== 1 || funcBodyLength !== 1)
        ) {
          return
        }

        const returnStatement = last(varDeclaratorBody || funcBody)
        const argument = dot("argument", returnStatement)

        if (isFunction(argument)) {
          return
        }

        context.report({
          message: "mapStateToProps should be a structured selector",
          node,
        })
      },
    }
  },
}
