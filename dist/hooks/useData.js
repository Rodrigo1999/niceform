"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function useData() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    var collector = react_1.default.useRef(null);
    collector.current = function (callback) { return callback.apply(void 0, data); };
    return function (cb) { return collector.current(cb); };
}
exports.default = useData;
