webpackJsonp([1],{1191:function(module,exports,__webpack_require__){"use strict";eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(0);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouterDom = __webpack_require__(101);\n\nvar _asyncRouter = __webpack_require__(520);\n\nvar _asyncRouter2 = _interopRequireDefault(_asyncRouter);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar sprintManage = (0, _asyncRouter2.default)(function () {\n  return __webpack_require__.e/* import() */(16).then(__webpack_require__.bind(null, 1543));\n});\n// const sprintDetails = asyncRouter(() => (import('./SprintDetails')));\n/**\r\n * Created by chenzl on 2017/9/5.\r\n * 用户故事地图页面\r\n */\n\nvar sprintDetailOther = (0, _asyncRouter2.default)(function () {\n  return __webpack_require__.e/* import() */(14).then(__webpack_require__.bind(null, 1550));\n});\nvar SPRINTIndex = function SPRINTIndex(_ref) {\n  var match = _ref.match;\n  return _react2.default.createElement(\n    _reactRouterDom.Switch,\n    null,\n    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: match.url, component: sprintManage }),\n    _react2.default.createElement(_reactRouterDom.Route, { path: match.url + '/:sprintId', component: sprintDetailOther })\n  );\n};\nexports.default = SPRINTIndex;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTE5MS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMva2FuYmFuZnJvbnQvY29udGFpbmVycy9vcmlnYW5pemF0aW9uL3NwcmludC9TUFJJTlRJbmRleC5qcz81MjdiIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGNoZW56bCBvbiAyMDE3LzkvNS5cclxuICog55So5oi35pWF5LqL5Zyw5Zu+6aG16Z2iXHJcbiAqL1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtcclxuICBSb3V0ZSxcclxuICBTd2l0Y2gsXHJcbn0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCBhc3luY1JvdXRlciBmcm9tICdhc3luY1JvdXRlcic7XHJcblxyXG5jb25zdCBzcHJpbnRNYW5hZ2UgPSBhc3luY1JvdXRlcigoKSA9PiAoaW1wb3J0KCcuL1NwcmludE1hbmFnZScpKSk7XHJcbi8vIGNvbnN0IHNwcmludERldGFpbHMgPSBhc3luY1JvdXRlcigoKSA9PiAoaW1wb3J0KCcuL1NwcmludERldGFpbHMnKSkpO1xyXG5jb25zdCBzcHJpbnREZXRhaWxPdGhlciA9IGFzeW5jUm91dGVyKCgpID0+IChpbXBvcnQoJy4vU3ByaW50RGV0YWlsT3RoZXInKSkpO1xyXG5jb25zdCBTUFJJTlRJbmRleCA9ICh7IG1hdGNoIH0pID0+IChcclxuICA8U3dpdGNoPlxyXG4gICAgPFJvdXRlIGV4YWN0IHBhdGg9e21hdGNoLnVybH0gY29tcG9uZW50PXtzcHJpbnRNYW5hZ2V9IC8+XHJcbiAgICA8Um91dGUgcGF0aD17YCR7bWF0Y2gudXJsfS86c3ByaW50SWRgfSBjb21wb25lbnQ9e3NwcmludERldGFpbE90aGVyfSAvPlxyXG4gIDwvU3dpdGNoPlxyXG4pO1xyXG5leHBvcnQgZGVmYXVsdCBTUFJJTlRJbmRleDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9rYW5iYW5mcm9udC9jb250YWluZXJzL29yaWdhbml6YXRpb24vc3ByaW50L1NQUklOVEluZGV4LmpzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQTtBQUNBOzs7QUFBQTtBQUNBO0FBR0E7QUFDQTs7Ozs7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQWJBOzs7OztBQWNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQU1BIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///1191\n")}});