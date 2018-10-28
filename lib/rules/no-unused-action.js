/**
 * @fileoverview warn on the action that is used only in mapDispatchToProps
 * @author Alexandr Metreniuc
 */
"use strict"

const { flatten, map, compose, prop, filter, ifElse } = require("ramda")
const { dot, hasName, isFunctionScope } = require("../utils")

module.exports = {
  meta: {
    docs: {
      description: "warn on the action that is used only in mapDispatchToProps",
      category: "Redux",
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    var getScopedVariables = (scope, vars = []) => {
      const names = scope.variables.map(x => x.name)
      vars.push(...names)

      const { childScopes } = scope
      if (childScopes.length === 0) {
        return
      }

      childScopes.forEach(s => getScopedVariables(s, vars))
      return vars
    }
    const declaredActions = []
    const usedProps = []
    let mdpNode
    let unusedActionFromScope

    return {
      // gather all action used in the function or class scope
      Identifier(node) {
        if (!hasName("mapDispatchToProps", node)) {
          return
        }
        mdpNode = node

        const actions = dot("init.properties", node.parent) || []
        const keys = actions.map(a => a.key.name)
        declaredActions.push(...keys)

        const scope = context.getScope()

        const scopedVars = getScopedVariables(scope)
        const unusedAction = keys.find(k => !scopedVars.includes(k))

        if (scopedVars.length > 0 && unusedAction) {
          unusedActionFromScope = unusedAction
        }
      },

      // gather all props used via "this.props"
      MemberExpression(node) {
        const propsAccess = dot("object.property.name", node)
        if (propsAccess) {
          usedProps.push(node.property.name)
        }
      },

      "Program:exit"() {
        const unusedActionFromInstance = declaredActions.find(
          a => !usedProps.includes(a)
        )
        const isUnusedActionFromScopeIsUsedFromInstance = usedProps.includes(
          unusedActionFromScope
        )
        const unusedAction = isUnusedActionFromScopeIsUsedFromInstance
          ? usedProps.length > 0 && unusedActionFromInstance
          : unusedActionFromScope

        if (unusedAction) {
          context.report({
            message: `${unusedAction} is not used`,
            node: mdpNode,
          })
        }
      },
    }
  },
}
