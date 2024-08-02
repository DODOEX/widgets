"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _jsxRuntime = require("react/jsx-runtime");
function createSvgIcon(path, displayName) {
  const Component = (props, ref) => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
    "data-testid": "".concat(displayName, "Icon"),
    viewBox: "0 0 24 24",
    width: "24px",
    height: "24px",
    ref: ref,
    ...props,
    children: path
  });
  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = "".concat(displayName, "Icon");
  }
  return /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(Component));
}
var _default = createSvgIcon;
exports.default = _default;