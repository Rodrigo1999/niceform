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
var react_1 = require("react");
var utils_1 = require("../utils");
var useData_1 = __importDefault(require("./useData"));
var useMemoizedAllFields_1 = __importDefault(require("./useMemoizedAllFields"));
function useValues(_a) {
    var fields = _a.fields, initialValues = _a.initialValues;
    var allFields = (0, useMemoizedAllFields_1.default)(fields, initialValues);
    var _b = (0, react_1.useState)(initialValues ? Object.fromEntries(Object.entries(initialValues).map(function (_a) {
        var key = _a[0];
        return [key, undefined];
    })) : {}), values = _b[0], setValues = _b[1];
    var getStates = (0, useData_1.default)({
        fields: fields,
        initialValues: initialValues,
        values: values,
        allFields: allFields
    });
    var actions = (0, react_1.useMemo)(function () { return ({
        //---------------------------------------------- seta o valor inicial do formulário -------------------------------------
        setInitialValues: function () {
            var _a = getStates(), initialValues = _a.initialValues, allFields = _a.allFields, values = _a.values;
            var fieldsActives = allFields.filter(function (field) { return field.active != false; });
            var _values = Object.assign({}, initialValues);
            if (_values) {
                var valuesCopied = Object.assign({}, values);
                fieldsActives.forEach(function (field) {
                    if (field.name && field.input) {
                        _values[field.name] = field.input(_values[field.name]);
                    }
                });
                (0, utils_1.resolveInitialValue)(_values, valuesCopied);
                setValues(valuesCopied);
            }
        },
        //---------------------------------------------- altera o valor de um determinado campo -------------------------------------
        changeValue: function (name, val, callback) {
            var _a = getStates(), fields = _a.fields, allFields = _a.allFields;
            var field = fields ? allFields.find(function (e) { return e.name == name; }) : undefined;
            if ((field === null || field === void 0 ? void 0 : field.active) !== false) {
                setValues(function (values) {
                    var _a, _b;
                    if (field === null || field === void 0 ? void 0 : field.dependence) {
                        var dependence = (_b = (_a = field.dependence) === null || _a === void 0 ? void 0 : _a.split) === null || _b === void 0 ? void 0 : _b.call(_a, '-');
                        for (var _i = 0, allFields_1 = allFields; _i < allFields_1.length; _i++) {
                            var field_1 = allFields_1[_i];
                            if (!field_1.dependence || !field_1.name)
                                continue;
                            var thisDependence = field_1.dependence.split('-');
                            if (dependence[0] == thisDependence[0] && parseInt(thisDependence[1]) > parseInt(dependence[1])) {
                                (0, utils_1.resolveValue)(values, field_1.name, undefined, true);
                            }
                        }
                    }
                    (0, utils_1.resolveValue)(values, name, val);
                    return __assign({}, values);
                });
            }
            callback === null || callback === void 0 ? void 0 : callback(field, val);
        },
        //---------------------------------------------- limpesa do formulário-------------------------------------
        cleanValues: function () {
            var allFields = getStates().allFields;
            var fields = allFields.filter(function (e) { return e.active != false; });
            setValues(function (values) {
                for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                    var field = fields_1[_i];
                    if (field.name)
                        (0, utils_1.resolveValue)(values, field.name, undefined, true);
                }
                return __assign({}, values);
            });
        }
    }); }, []);
    //---------------------------------------------- inicialização -------------------------------------
    (0, react_1.useEffect)(function () {
        if (Object.values(initialValues || {}).length)
            actions.setInitialValues();
    }, [initialValues]);
    return {
        values: values,
        cleanValues: actions.cleanValues,
        setInitialValues: actions.setInitialValues,
        changeValue: actions.changeValue,
        setValues: setValues,
        valuesChain: (0, react_1.useMemo)(function () { return (0, utils_1.getValuesByKeyRange)(values); }, [values])
    };
}
exports.default = useValues;
