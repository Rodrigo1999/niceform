"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function useData(data) {
    var collector = react_1.default.useRef(null);
    collector.current = function () { return data; };
    return function () { return collector.current(); };
}
exports.default = useData;
