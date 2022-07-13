"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var useData_1 = __importDefault(require("./useData"));
function memoization(Component) {
    return function (props) {
        var _getData = (0, useData_1.default)(props);
        var getData = react_1.default.useCallback(_getData, []);
        return (0, jsx_runtime_1.jsx)(Component, { getData: getData });
    };
}
exports.default = memoization;
