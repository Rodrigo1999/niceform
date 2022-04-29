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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("../utils");
function useErrors(_a) {
    var _this = this;
    var fields = _a.fields, errorsControl = _a.errorsControl, yupSchema = _a.yupSchema, values = _a.values;
    var _b = (0, react_1.useState)({}), errors = _b[0], setErrors = _b[1];
    var allFields = (0, react_1.useMemo)(function () {
        var _fields = fields || [];
        if (!fields) {
            _fields = Object.entries(values || {}).map(function (e) { return ({ name: e[0] }); });
        }
        return (0, utils_1.getAllFields)(_fields);
    }, [fields, values]);
    //---------------------------------------------- Retorna os erros encontrados em um campo -------------------------------------
    var verifyErrors = function (field) { return __awaiter(_this, void 0, void 0, function () {
        var errors, _loop_1, _i, errorsControl_1, functionReturnPersonError, value_1, err;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = {};
                    if (!errorsControl) return [3 /*break*/, 4];
                    _loop_1 = function (functionReturnPersonError) {
                        var value, err;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!field.name)
                                        return [2 /*return*/, "continue"];
                                    value = values[field.name];
                                    return [4 /*yield*/, functionReturnPersonError({ field: field, value: value, validateSchema: function (schema) { return (0, utils_1.validateSchemaOnlyField)(schema, value || ''); } })];
                                case 1:
                                    err = _b.sent();
                                    if (err)
                                        errors[field.name] = err;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, errorsControl_1 = errorsControl;
                    _a.label = 1;
                case 1:
                    if (!(_i < errorsControl_1.length)) return [3 /*break*/, 4];
                    functionReturnPersonError = errorsControl_1[_i];
                    return [5 /*yield**/, _loop_1(functionReturnPersonError)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!field.error) return [3 /*break*/, 6];
                    value_1 = values[field.name];
                    return [4 /*yield*/, field.error({
                            fields: allFields,
                            field: field,
                            values: values,
                            value: value_1,
                            validateSchema: function (schema) { return (0, utils_1.validateSchemaOnlyField)(schema, value_1 || ''); }
                        })];
                case 5:
                    err = _a.sent();
                    if (err)
                        errors[field.name] = err;
                    _a.label = 6;
                case 6: return [2 /*return*/, errors];
            }
        });
    }); };
    //---------------------------------------------- salva no estado e retorna os erros encontrados para todos os campos -------------------------------------
    var verifyAllErrors = function (name) { return __awaiter(_this, void 0, void 0, function () {
        var fd, errors, errorYup, _i, fd_1, field, errorThisField, errorsResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fd = [];
                    if (name) {
                        fd = allFields.filter(function (e) { return e.active != false && e.name == name; });
                    }
                    else {
                        fd = allFields.filter(function (e) { return e.active != false; });
                    }
                    errors = {};
                    if (!yupSchema) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, utils_1.errorSchema)(yupSchema, fd, values, !fields, !!name)];
                case 1:
                    errorYup = _a.sent();
                    _a.label = 2;
                case 2:
                    _i = 0, fd_1 = fd;
                    _a.label = 3;
                case 3:
                    if (!(_i < fd_1.length)) return [3 /*break*/, 6];
                    field = fd_1[_i];
                    if (!field.name)
                        return [3 /*break*/, 5];
                    return [4 /*yield*/, verifyErrors(field)];
                case 4:
                    errorThisField = _a.sent();
                    errors = __assign(__assign({}, errors), errorThisField);
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    errorsResult = __assign(__assign({}, errorYup), errors);
                    setErrors(function (errors) {
                        var errorsCloned = Object.assign({}, errors);
                        fd.forEach(function (field) {
                            if (field.name)
                                delete errorsCloned[field.name];
                        });
                        if (name && !errors[name.toString()] && !errorsResult[name.toString()]) {
                            return errors;
                        }
                        return __assign(__assign({}, errorsCloned), errorsResult);
                    });
                    return [2 /*return*/, errorsResult];
            }
        });
    }); };
    //---------------------------------------------- limpa os erros -------------------------------------
    var cleanErrors = function () { return setErrors({}); };
    return { errors: errors, verifyAllErrors: verifyAllErrors, cleanErrors: cleanErrors };
}
exports.default = useErrors;
