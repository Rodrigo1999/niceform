"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContextSelector = exports.useContext = exports.Context = exports.createContext = void 0;
var react_1 = __importDefault(require("react"));
var dequal_1 = __importDefault(require("./dequal"));
var CONTEXT_VALUE = Symbol();
function useForceUpdate() {
    var _a = react_1.default.useState(0), value = _a[0], setValue = _a[1]; // integer state
    return function () { return setValue(function (value) { return value + 1; }); }; // update the state to force render
}
function createProvider(Provider) {
    return function CreateProvider(_a) {
        var _b;
        var value = _a.value, children = _a.children;
        var ref = react_1.default.useRef(null);
        if (!ref.current) {
            ref.current = (_b = {},
                _b[CONTEXT_VALUE] = {
                    listeners: new Set(),
                    id: Math.random(),
                    value: value
                },
                _b);
        }
        react_1.default.useEffect(function () {
            if (ref.current)
                ref.current[CONTEXT_VALUE].listeners.forEach(function (callback) {
                    callback(value);
                });
        }, [value]);
        return react_1.default.createElement(Provider, { value: ref.current }, children);
    };
}
function createContext(value) {
    var _a;
    var context = react_1.default.createContext((_a = {},
        _a[CONTEXT_VALUE] = {
            listeners: new Set(),
            id: Math.random(),
            value: value
        },
        _a));
    context.Provider = createProvider(context.Provider);
    return context;
}
exports.createContext = createContext;
exports.Context = createContext({});
function useContext() {
    return useContextSelector(function (e) { return e; });
}
exports.useContext = useContext;
function useContextSelector(callback) {
    var context = react_1.default.useContext(exports.Context)[CONTEXT_VALUE];
    var result = react_1.default.useRef(callback(context.value));
    var forceUpdate = useForceUpdate();
    var checkUpdate = react_1.default.useCallback(function (ctx) {
        var data = callback(ctx || context.value);
        if (!(0, dequal_1.default)(result.current, data)) {
            result.current = data;
            forceUpdate();
        }
    }, []);
    react_1.default.useEffect(function () {
        context.listeners.add(checkUpdate);
        return function () {
            context.listeners.delete(checkUpdate);
        };
    }, []);
    return result.current;
}
exports.useContextSelector = useContextSelector;
