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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("../utils");
function callbackGetAllFields(fields, initialValues) {
    var _fields = fields || [];
    if (!fields) {
        _fields = Object.entries(initialValues || {}).map(function (e) { return ({ name: e[0] }); });
    }
    return (0, utils_1.getAllFields)(_fields);
}
function useValues(_a) {
    var fields = _a.fields, initialValues = _a.initialValues, hasChildrenInstance = _a.hasChildrenInstance;
    var _b = (0, react_1.useState)({}), values = _b[0], setValues = _b[1];
    var allFields = (0, react_1.useMemo)(function () { return callbackGetAllFields(fields, initialValues); }, [fields, initialValues]);
    if (hasChildrenInstance)
        allFields = callbackGetAllFields(fields, initialValues);
    //---------------------------------------------- seta o valor inicial do formulário -------------------------------------
    var setInitialValues = function () {
        var fieldsActives = allFields.filter(function (e) { return e.active != false; });
        var _values = Object.assign({}, initialValues);
        if (_values) {
            var valuesCloned = Object.assign({}, values);
            fieldsActives.forEach(function (e) {
                if (e.name && e.input) {
                    _values[e.name] = e.input(_values[e.name]);
                }
            });
            (0, utils_1.resolveInitialValue)(_values, valuesCloned);
            setValues(valuesCloned);
        }
    };
    //---------------------------------------------- altera o valor de um determinado campo -------------------------------------
    var changeValue = function (name, val, cb) {
        var fd = fields ? allFields.find(function (e) { return e.active != false && e.name == name; }) : undefined;
        setValues(function (values) {
            var _a, _b;
            if (fd && fd.dependence) {
                var dependence_1 = (_b = (_a = fd.dependence) === null || _a === void 0 ? void 0 : _a.split) === null || _b === void 0 ? void 0 : _b.call(_a, '-');
                allFields.forEach(function (e) {
                    if (!e.dependence)
                        return false;
                    var thisDependence = e.dependence.split('-');
                    if (dependence_1[0] == thisDependence[0] && parseInt(thisDependence[1]) > parseInt(dependence_1[1])) {
                        if (e.name)
                            (0, utils_1.resolveValue)(values, e.name, undefined, true);
                    }
                });
            }
            (0, utils_1.resolveValue)(values, name, val);
            return __assign({}, values);
        });
        cb === null || cb === void 0 ? void 0 : cb(fd, val);
    };
    //---------------------------------------------- limpesa do formulário-------------------------------------
    var cleanValues = function () {
        var fd = allFields.filter(function (e) { return e.active != false; });
        setValues(function (values) {
            for (var index = 0; index < fd.length; index++) {
                var element = fd[index];
                if (element.name)
                    (0, utils_1.resolveValue)(values, element.name, undefined, true);
            }
            return __assign({}, values);
        });
    };
    //---------------------------------------------- inicialização -------------------------------------
    (0, react_1.useEffect)(function () {
        setInitialValues();
    }, [initialValues]);
    return { values: values, cleanValues: cleanValues, setValues: setValues, setInitialValues: setInitialValues, changeValue: changeValue };
}
exports.default = useValues;
