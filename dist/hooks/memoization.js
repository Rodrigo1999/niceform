"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var useData_1 = __importDefault(require("./useData"));
function getFilterObject(obj, arrayKeys) {
    var keys = Object.keys(obj);
    var objInclude = {};
    var objExclude = {};
    if (Array.isArray(arrayKeys)) {
        keys.forEach(function (key) {
            if (arrayKeys.includes(key))
                objInclude[key] = obj[key];
            else
                objExclude[key] = obj[key];
        });
        return { objInclude: objInclude, objExclude: objExclude };
    }
    else {
        if (arrayKeys)
            objInclude = obj;
        else
            objExclude = obj;
        return { objInclude: objInclude, objExclude: objExclude };
    }
}
var FieldContext = react_1.default.createContext({});
exports.FieldContext = FieldContext;
function memoization(Component) {
    return function (props) {
        var _a = react_1.default.useReducer(function () { return Math.random(); }, 0), key = _a[0], update = _a[1];
        var obj = getFilterObject(props, props.otimization);
        var _getData = (0, useData_1.default)(obj.objInclude);
        var getData = react_1.default.useCallback(_getData, []);
        return ((0, jsx_runtime_1.jsx)(FieldContext.Provider, __assign({ value: getData }, { children: (0, jsx_runtime_1.jsx)(Component, __assign({}, obj.objExclude, { getData: getData, update: update })) }), key));
    };
}
exports.default = memoization;
