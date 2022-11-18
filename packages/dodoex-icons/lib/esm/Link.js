"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createSvgIcon = _interopRequireDefault(require("./utils/createSvgIcon"));

var _jsxRuntime = require("react/jsx-runtime");

var _default = (0, _createSvgIcon.default)([/*#__PURE__*/(0, _jsxRuntime.jsx)("defs", {
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("filter", {
    id: "a",
    "color-interpolation-filters": "auto",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("feColorMatrix", {
      in: "SourceGraphic",
      values: "0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"
    })
  })
}, "0"), /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
  fill: "none",
  fillRule: "evenodd",
  filter: "url(#a)",
  transform: "translate(-3 -3)",
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("g", {
    fill: "#CCC",
    fillRule: "nonzero",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      d: "m5.3001 8.1062-1.402 1.4565c-1.1974 1.2439-1.1974 3.2606 0 4.5044 1.1973 1.2439 3.1386 1.2439 4.336 0l1.868-1.9417c.7037-.731 1.022-1.7713.8537-2.7901-.1682-1.019-.802-1.8896-1.6998-2.3353l-.5988.6221a1.0587 1.0587 0 0 0-.1574.2113c.6956.2077 1.2335.782 1.4143 1.51.1808.728-.0224 1.5011-.5344 2.0325l-1.8671 1.9407c-.7986.8296-2.0934.8296-2.892 0-.7987-.8297-.7987-2.1748 0-3.0044l.8103-.8408a4.4243 4.4243 0 0 1-.1308-1.3663v.001Z"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      d: "M7.8978 5.8739c-.7036.7311-1.0218 1.7715-.8536 2.7905.1682 1.019.802 1.8898 1.6998 2.3356l.792-.824c-.7052-.1964-1.256-.7689-1.4448-1.5016-.1889-.7328.0128-1.5146.5291-2.051l1.8671-1.9408c.7986-.8297 2.0934-.8297 2.892 0 .7987.8297.7987 2.175 0 3.0048l-.8103.8409a4.431 4.431 0 0 1 .1308 1.3664l1.402-1.4567c1.1974-1.244 1.1974-3.261 0-4.505-1.1973-1.244-3.1386-1.244-4.336 0L7.898 5.874Z"
    })]
  })
}, "1")], 'Link');

exports.default = _default;