"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("../utils");
var utils_2 = require("../utils");
/**
 *
 * @example
 * export default memo(({
    name,
    changeValue
}) => {

    const [value, onChange] = useDebounce(name[, callback]) // callback is default changeValue

    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            ...
        />
    )
})
 */
function useDebounce(name, callback) {
    var _a;
    var _b = (0, react_1.useState)(''), value = _b[0], setValue = _b[1];
    var _value = (0, utils_2.useContextSelector)(function (state) { return state.valuesChain[name]; });
    var _changeValue = (0, utils_2.useContextSelector)(function (state) { return state.changeValue; });
    var time = (0, utils_2.useContextSelector)(function (state) { var _a, _b; return (_b = (_a = state.allFields.find(function (e) { return e.name == name; })) === null || _a === void 0 ? void 0 : _a.timeDebounce) !== null && _b !== void 0 ? _b : state.props.timeDebounce; }) || 400;
    var enableDebounce = (_a = (0, utils_2.useContextSelector)(function (state) { var _a, _b; return (_b = (_a = state.allFields.find(function (e) { return e.name == name; })) === null || _a === void 0 ? void 0 : _a.enableDebounce) !== null && _b !== void 0 ? _b : state.props.enableDebounce; })) !== null && _a !== void 0 ? _a : true;
    (0, react_1.useEffect)(function () {
        if (enableDebounce)
            if (value !== _value)
                setValue(_value || '');
    }, [_value]);
    var onChangeDebounce = (0, react_1.useMemo)(function () { return (0, utils_1.debounce)(function (evt, value, other, cb) { return cb(evt, value, other); }, time); }, []);
    function changeValue(foo, bar) {
        if (typeof this == 'function')
            name = this().name;
        var value = getValue(foo);
        if (enableDebounce) {
            onChangeDebounce(name, value, bar, callback || _changeValue);
            setValue(value);
        }
        else {
            _changeValue(name, value, bar);
        }
    }
    return [enableDebounce ? value : _value, changeValue.bind(this)];
}
exports.default = useDebounce;
function getValue(foo) {
    var _a;
    var value;
    if ((typeof foo !== 'string') && (foo === null || foo === void 0 ? void 0 : foo.constructor) !== {}.constructor && (foo === null || foo === void 0 ? void 0 : foo.target))
        value = (_a = foo === null || foo === void 0 ? void 0 : foo.target) === null || _a === void 0 ? void 0 : _a.value;
    else
        value = foo;
    return value;
}
