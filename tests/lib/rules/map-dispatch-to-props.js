/**
 * @fileoverview prefer object literal
 * @author Alexandr Metreniuc
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/map-dispatch-to-props"),
  RuleTester = require("eslint").RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const parserOptions = {
  ecmaVersion: 2018,
  sourceType: "module",
}
var ruleTester = new RuleTester({ parserOptions })
ruleTester.run("map-dispatch-to-props", rule, {
  valid: [
    `const mapDispatchToProps = {
        a,
        b: bb
      }`,

    `function mapDispatchToProps(dispatch, props) {
        return {
          a,
          b: bb
        }
      }`,

    `const mapDispatchToProps = (dispatch, props) => {
        return {
          a,
          b: bb
        }
      }`,
  ],

  invalid: [
    {
      code: `function mapDispatchToProps(dispatch) {
        return {
          a,
          b: bb
        }
      }`,
      errors: [
        {
          message: "mapDispatchToProps should be an object literal",
          //   type: "error",
        },
      ],
    },
    {
      code: `const mapDispatchToProps = dispatch => {
        return {
          a,
          b: bb
        }
      }`,
      errors: [
        {
          message: "mapDispatchToProps should be an object literal",
          //   type: "error",
        },
      ],
    },
    {
      code: `const mapDispatchToProps = dispatch => ({
        a,
        b: bb
      })`,
      errors: [
        {
          message: "mapDispatchToProps should be an object literal",
          //   type: "error",
        },
      ],
    },
  ],
})
