/**
 * @fileoverview prefer structured selector to a function
 * @author Alexandr Metreniuc
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/map-state-to-props"),
  RuleTester = require("eslint").RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
}
var ruleTester = new RuleTester({ parserOptions })
ruleTester.run("map-state-to-props", rule, {
  valid: [
    `
    function mapStateToProps(state, {productId}) {
        const isChannelInBundle = makeIsChannelInBundle(
          productId,
          COMBOPACK_BUNDLE_ID
        );
      
        return {
          isAuthenticated: isUserAuthenticated(state),
          accountId: getUserAccountId(state),
          isBundleChannel: isChannelInBundle(state),
          isProductSubscribable: isProductSubscribableFromProps(state, {productId}),
          isLoading: isLoading(state),
        };
      }
    `,
    `
    function mapStateToProps(state) {
        const selectA = makeSelector(100)
        return {
            a: selectA(state),
        }
    }
    `,
    `
    const mapStateToProps = (state) => {
        const selectA = makeSelector(100)
        return {
            a: selectA(state),
        }
    }
    `,
    `
    function mapStateToProps(initialState) {
        return state => ({
            a: selectA(state),
            b: selectB(initialState)
        })
    }
    `,
    `
    function mapStateToProps(initialState) {
        return function(state) {
            return {
                a: selectA(state),
                b: selectB(initialState)
            }
        }
    }
    `,
    `
    const mapStateToProps = (initialState) => {
        return state => ({
            a: selectA(state),
            b: selectB(initialState)
        })
    }
    `,
  ],

  invalid: [
    {
      code: `
      function mapStateToProps(state) {
        return {
            a: selectA(state),
        }
      }
      `,
      errors: [
        {
          message: "mapStateToProps should be a structured selector",
        },
      ],
    },
    {
      code: `
      const mapStateToProps = state => {
        return {
            a: selectA(state),
        }
      }
      `,
      errors: [
        {
          message: "mapStateToProps should be a structured selector",
        },
      ],
    },
  ],
})
