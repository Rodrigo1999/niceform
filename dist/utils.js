"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInComponent = exports.filterProperty = exports.getComponentBase = exports.validateSchemaOnlyField = exports.errorSchema = exports._try = exports.resolveInitialValue = exports.getValuesByKeyRange = exports.resolveValue = exports.getField = exports.getAllFields = exports.debounce = exports.objectToForm = exports.dequal = void 0;
var dequal_1 = require("./dequal");
Object.defineProperty(exports, "dequal", { enumerable: true, get: function () { return __importDefault(dequal_1).default; } });
//---------------------------------------------- serializa os valores do formulário para formData-------------------------------------
function objectToForm(obj, form, level) {
    var f = form || new FormData();
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            var levelProp = level ? level + '[' + k + ']' : k;
            // If it is a date, it parses to ISO format
            if (obj[k] instanceof Date) {
                f.set(levelProp, obj[k].toISOString());
                continue;
            }
            else if (obj[k] === null || obj[k] === undefined) {
                f.set(levelProp, '');
                continue;
            }
            else if (typeof obj[k] === 'object' && !(obj[k] instanceof File) && !(obj[k] instanceof Blob)) {
                objectToForm(obj[k], f, levelProp);
                continue;
            }
            f.set(levelProp, obj[k]);
        }
    }
    return f;
}
exports.objectToForm = objectToForm;
//---------------------------------------------- debounce -------------------------------------
function debounce(fn, ms) {
    var timer = 0;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timer);
        timer = setTimeout(fn.bind.apply(fn, __spreadArray([this], args, false)), ms || 0);
    };
}
exports.debounce = debounce;
//---------------------------------------------- retorna todos os campos -------------------------------------
function getAllFields(fields) {
    return fields.flatMap(function (field) { return field.fields ? getAllFields(field.fields) : field; });
}
exports.getAllFields = getAllFields;
//---------------------------------------------- retorna todos um campo específico ---------------------------
function getField(fields, name, active) {
    var allFields = getAllFields(fields);
    var field = allFields;
    if (active)
        field = field.filter(function (e) { return e.active != false; });
    return field.find(function (e) { return e.name == name; });
}
exports.getField = getField;
//---------------------------------------------- retorna ou insere um valor a partir de uma cadeia de objetos ---------------------------
function resolveValue(obj, prop, val, valueIsUndefined) {
    if (typeof obj === 'undefined')
        return;
    prop = prop.replace(/(\[\d+\])/g, '.$1').replace(/\[|]/g, '');
    var arr = prop.split('.');
    return arr.reduce(function (prev, curr, i) {
        var last = arr.length - 1 == i;
        if (!prev[curr] && !last) {
            if (!isNaN(parseInt(arr[i + 1]))) {
                prev[curr] = [];
            }
            else {
                prev[curr] = {};
            }
        }
        if (last && (val !== undefined || valueIsUndefined))
            prev[curr] = val;
        return prev[curr];
    }, obj);
}
exports.resolveValue = resolveValue;
//---------------------------------------------- transforma um objeto em uma cadeia de objeto ---------------------------
function getValuesByKeyRange(values) {
    var arrValues = [];
    function getKeysRange(obj) {
        var entries = Object.entries(obj);
        var map = entries.map(function (e) {
            var _a;
            if (Array.isArray(e[1]) || ((_a = e[1]) === null || _a === void 0 ? void 0 : _a.constructor) == ({}).constructor) {
                return getKeysRange(e[1]).map(function (n) { return "".concat(e[0], ".").concat(n); });
            }
            else {
                arrValues.push(e[1]);
                return e[0];
            }
        });
        return map.flatMap(function (e) { return e; });
    }
    return getKeysRange(values).reduce(function (obj, e, i) {
        obj[e] = arrValues[i];
        return obj;
    }, {});
}
exports.getValuesByKeyRange = getValuesByKeyRange;
//---------------------------------------------- resolve valores iniciais já pré definidos ---------------------------
function resolveInitialValue(values, valuesCloned) {
    Object.keys(values).forEach(function (k) {
        if (typeof valuesCloned[k] == 'object')
            resolveInitialValue(values[k], valuesCloned[k]);
        if (valuesCloned[k] === undefined) {
            valuesCloned[k] = values[k];
        }
    });
}
exports.resolveInitialValue = resolveInitialValue;
//---------------------------------------------- Tratativa melhor de erros ---------------------------
function _try(promisse) {
    return promisse.then(function (result) { return [null, result]; }).catch(function (error) { return [error]; });
}
exports._try = _try;
//---------------------------------------------- tratativa do schema com yup ---------------------------
function errorSchema(schema, fields, values, basic, omit) {
    return __awaiter(this, void 0, void 0, function () {
        var omitSchema, arrFieldsKey_1, arrFieldsSchema, fieldsToKeyValue, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    omitSchema = [];
                    if (omit) {
                        arrFieldsKey_1 = fields.map(function (e) { return e.name || ''; });
                        arrFieldsSchema = Object.keys(schema.fields);
                        omitSchema = arrFieldsSchema.filter(function (e) { return !arrFieldsKey_1.includes(e); });
                    }
                    if (!(schema === null || schema === void 0 ? void 0 : schema.validate))
                        return [2 /*return*/];
                    if (basic) {
                        fieldsToKeyValue = getValuesByKeyRange(values);
                    }
                    else {
                        fieldsToKeyValue = fields.reduce(function (obj, e) {
                            if (e.name !== undefined)
                                obj[e.name] = resolveValue(values, e.name);
                            return obj;
                        }, {});
                    }
                    return [4 /*yield*/, _try(schema.omit(omitSchema).validate(fieldsToKeyValue, { abortEarly: false }))];
                case 1:
                    error = (_a.sent())[0];
                    if (error)
                        return [2 /*return*/, error.inner.reduce(function (obj, error) {
                                obj[error.path.replace(/^\[|]$/g, '')] = error.message;
                                return obj;
                            }, {})];
                    return [2 /*return*/];
            }
        });
    });
}
exports.errorSchema = errorSchema;
function validateSchemaOnlyField(schema, value) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(schema === null || schema === void 0 ? void 0 : schema.validate))
                        return [2 /*return*/];
                    return [4 /*yield*/, _try(schema.validate(value))];
                case 1:
                    error = (_a.sent())[0];
                    if (error)
                        return [2 /*return*/, error.message];
                    return [2 /*return*/];
            }
        });
    });
}
exports.validateSchemaOnlyField = validateSchemaOnlyField;
//---------------------------------------------- retorna o componente de campo correspondente a seu type ---------------------------
function getComponentBase(components, field, type) {
    return components.find(function (component) {
        if (type || field.type)
            return [].concat(component.type).includes(type || field.type);
    });
}
exports.getComponentBase = getComponentBase;
//---------------------------------------------- filter Properties ---------------------------
function filterProperty(_obj, filter) {
    var obj = Object.entries(_obj);
    if (Array.isArray(filter)) {
        obj = obj.filter(function (e) { return !filter.includes(e[0]); });
    }
    else if (filter) {
        obj = obj.filter(filter);
    }
    obj = Object.fromEntries(obj);
    return obj;
}
exports.filterProperty = filterProperty;
//---------------------------------------------- find items by renderField in Dom element ---------------------------
function findInComponent(obj) {
    var items = Array();
    function each(obj) {
        var _a, _b;
        if (Array.isArray(obj) || (obj === null || obj === void 0 ? void 0 : obj.constructor) == ({}).constructor) {
            for (var key in obj) {
                if ((Array.isArray(obj[key]) || ((_a = obj[key]) === null || _a === void 0 ? void 0 : _a.constructor) == (new Object).constructor)) {
                    if ((_b = obj[key]) === null || _b === void 0 ? void 0 : _b.isRenderField)
                        items.push(obj[key]);
                    each(obj[key]);
                }
            }
        }
    }
    each(obj);
    return items.map(function (e) { return e.constructorObject; }).filter(Boolean);
}
exports.findInComponent = findInComponent;
