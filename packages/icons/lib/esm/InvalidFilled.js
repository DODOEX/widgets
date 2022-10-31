"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createSvgIcon = _interopRequireDefault(require("./utils/createSvgIcon"));

var _jsxRuntime = require("react/jsx-runtime");

var _default = (0, _createSvgIcon.default)([/*#__PURE__*/(0, _jsxRuntime.jsx)("circle", {
  cx: "16",
  cy: "16",
  r: "16",
  fill: "currentColor",
  fillOpacity: ".1"
}, "0"), /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
  fill: "#1a1a1b",
  d: "M10 14.75h12v2.5H10v-2.5Z"
}, "1")], 'InvalidFilled');

exports.default = _default;