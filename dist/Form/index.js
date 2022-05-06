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
exports.create = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var dynamic_react_grid_1 = __importDefault(require("dynamic-react-grid"));
var react_2 = require("react");
var useErrors_1 = __importDefault(require("../hooks/useErrors"));
var useValues_1 = __importDefault(require("../hooks/useValues"));
var useData_1 = __importDefault(require("../hooks/useData"));
var utils_1 = require("../utils");
var Form = function (props, ref) {
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g;
    var Context = (0, react_2.useRef)({
        errorsControl: [],
        components: [],
        onError: function () { return null; },
        ComponentWrap: dynamic_react_grid_1.default,
        button: undefined,
        footerProps: {},
        context: {}
    });
    props = __assign(__assign({}, Context.current.context), props);
    var lastChangedField = (0, react_2.useRef)([]);
    var isSubmited = (0, react_2.useRef)(false);
    var form = (0, react_2.useRef)(null);
    var _h = (0, react_2.useState)([]), fieldsFromRender = _h[0], setFieldsFromRender = _h[1];
    var fields = (_b = (_a = props.fields) === null || _a === void 0 ? void 0 : _a.concat) === null || _b === void 0 ? void 0 : _b.call(_a, props.staticFields || []);
    var hookValues = (0, useValues_1.default)({
        fields: (fields || []).concat(fieldsFromRender),
        initialValues: (0, react_2.useMemo)(function () { return Object.assign({}, props.initialValues, props.fixedValues); }, [props.initialValues, props.fixedValues])
    });
    var hookErrors = (0, useErrors_1.default)({
        fields: (fields || []).concat(fieldsFromRender).filter(function (e) { return e.active != false; }),
        values: hookValues.valuesChain,
        errorsControl: (_c = Context === null || Context === void 0 ? void 0 : Context.current) === null || _c === void 0 ? void 0 : _c.errorsControl,
        yupSchema: props.validationSchema
    });
    var getStates = (0, useData_1.default)({
        fieldsFromRender: fieldsFromRender,
        fields: props === null || props === void 0 ? void 0 : props.fields,
        hookValues: hookValues,
        hookErrors: hookErrors,
        isSubmited: isSubmited
    });
    (0, react_2.useEffect)(function () {
        if (lastChangedField.current[0] && isSubmited.current) {
            hookErrors.verifyAllErrors(lastChangedField.current[0]);
        }
    }, [hookValues.values, isSubmited]);
    //---------------------------------------------- ações básicas -------------------------------------
    var actions = (0, react_2.useMemo)(function () { return ({
        verifyAllErrors: function () {
            return getStates(function (_a) {
                var hookErrors = _a.hookErrors;
                return hookErrors.verifyAllErrors();
            });
        },
        clean: function () {
            getStates(function (_a) {
                var hookValues = _a.hookValues, hookErrors = _a.hookErrors, isSubmited = _a.isSubmited;
                hookErrors.cleanErrors();
                hookValues.cleanValues();
                isSubmited.current = false;
            });
        },
        changeValue: function (evt, value, others) {
            var _name = '';
            var _value;
            if (typeof evt == 'string') {
                _name = evt;
                _value = value;
            }
            else {
                _name = evt.target.name;
                _value = evt.target.value;
            }
            getStates(function (_a) {
                var fieldsFromRender = _a.fieldsFromRender, fields = _a.fields, hookValues = _a.hookValues;
                var fd = (0, utils_1.getField)((fields || []).concat(fieldsFromRender), _name, false);
                hookValues.changeValue(_name, _value, function (field, value) {
                    var _a;
                    lastChangedField.current = [_name, _value];
                    (_a = props.onChangeField) === null || _a === void 0 ? void 0 : _a.call(props, field || fd, value, others);
                });
            });
        }
    }); }, []);
    //---------------------------------------------- submição de formulário -------------------------------------
    var submit = function (evt) { return __awaiter(_this, void 0, void 0, function () {
        var errors, cloneValues, fd;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (_a = evt === null || evt === void 0 ? void 0 : evt.preventDefault) === null || _a === void 0 ? void 0 : _a.call(evt);
                    isSubmited.current = true;
                    return [4 /*yield*/, hookErrors.verifyAllErrors()];
                case 1:
                    errors = _f.sent();
                    cloneValues = (0, utils_1.clone)(hookValues.values);
                    if (fields) {
                        fd = (0, utils_1.getAllFields)(fields).filter(function (field) { return field.active != false; });
                        fd.filter(function (e) { return e.output && e.visible != false; }).forEach(function (e) {
                            if (e.name)
                                cloneValues[e.name] = e.output(hookValues.values[e.name]);
                        });
                    }
                    (_b = props.onBeforeSubmit) === null || _b === void 0 ? void 0 : _b.call(props, cloneValues);
                    if (!!Object.values(errors).length) {
                        (_d = (_c = Context === null || Context === void 0 ? void 0 : Context.current) === null || _c === void 0 ? void 0 : _c.onError) === null || _d === void 0 ? void 0 : _d.call(_c, errors);
                        return [2 /*return*/, false];
                    }
                    else {
                        if (props.formData)
                            cloneValues = (0, utils_1.objectToForm)(cloneValues);
                        (_e = props.onSubmit) === null || _e === void 0 ? void 0 : _e.call(props, cloneValues);
                        if (props.clean)
                            actions.clean();
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // --------------------------------------- renderização isolada de um determinado componente------------------------------
    function renderField(obj) {
        var comp = obj.wrap ? obj.wrap(getFieldComponent(obj)) : getFieldComponent(obj);
        comp = __assign({}, comp);
        Object.defineProperty(comp, 'constructorObject', {
            enumerable: false,
            configurable: true,
            value: obj
        });
        Object.defineProperty(comp, 'isRenderField', {
            enumerable: false,
            configurable: true,
            value: true
        });
        return comp;
    }
    var setFieldsFromRenderDebounce = (0, react_2.useMemo)(function () { return (0, utils_1.debounce)(function (fields, fieldsFromRender) {
        var filter = function (data) { return typeof data[1] != 'function'; };
        var formatFieldsToCompare = function (fields) { return fields.map(function (field) { return (0, utils_1.filterProperty)(field || {}, filter); }); };
        if (!(0, utils_1.dequal)(formatFieldsToCompare(fields), formatFieldsToCompare(fieldsFromRender))) {
            setFieldsFromRender(__spreadArray([], fields, true));
        }
    }, 100); }, []);
    function connectChildren(element) {
        setFieldsFromRenderDebounce((0, utils_1.findComponentByRenderFieldOnTreeDom)(element), fieldsFromRender);
        return element;
    }
    //---------------------------------------------- inicialização ---------------------------------------------
    var argumentsToContexts = {
        props: props,
        errors: hookErrors.errors,
        values: hookValues.values,
        valuesChain: hookValues.valuesChain,
        verifyAllErrors: actions.verifyAllErrors,
        changeValue: actions.changeValue,
        submit: submit,
        clean: actions.clean,
        allFields: (fields ? (0, utils_1.getAllFields)(fields) : []).concat(fieldsFromRender),
        renderField: renderField
    };
    var localContext = (this === null || this === void 0 ? void 0 : this(argumentsToContexts)) || {};
    var propsContext = ((_d = props.create) === null || _d === void 0 ? void 0 : _d.call(props, argumentsToContexts)) || {};
    var getAttr = function (attr, defaultValue) { return propsContext[attr] || localContext[attr] || defaultValue; };
    Context.current = {
        errorsControl: getAttr('errorsControl', []),
        components: getAttr('components', []),
        onError: getAttr('onError', function () { return null; }),
        ComponentWrap: getAttr('ComponentWrap', dynamic_react_grid_1.default),
        button: getAttr('button'),
        footerProps: getAttr('footerProps'),
        context: getAttr('context'),
    };
    //---------------------------------------------- controle de referência -------------------------------------
    (0, react_2.useImperativeHandle)(Object.keys(props.innerRef || ref || {}).length ? props.innerRef || ref : { current: null }, function () { return (__assign(__assign({}, argumentsToContexts), { form: form === null || form === void 0 ? void 0 : form.current, setValues: hookValues.setValues })); });
    //---------------------------------------------- controle de linhas e colunas -------------------------------------
    var configRow = {
        row: true,
        alignItems: props.alignItems || 'flex-start',
        justify: props.justify,
        align: props.align,
        direction: props.direction,
        spacing: props.spacing || 2,
    };
    var _getComponentBase = function (components, field) { return (0, utils_1.getComponentBase)(components, field) || (0, utils_1.getComponentBase)(components, field, 'default'); };
    function getFieldComponent(field) {
        var _a, _b, _c;
        if (fields || props.children) {
            if (field.fields)
                return render(field.fields);
            if (field.type == 'component' && field.content) {
                var comp = field.content(__assign(__assign({}, argumentsToContexts), { fields: fields || [] }));
                setFieldsFromRenderDebounce((0, utils_1.findComponentByRenderFieldOnTreeDom)(comp), fieldsFromRender);
                return comp;
            }
            var _field = (0, utils_1.filterProperty)(field, ['input', 'output']);
            return (_c = (_b = _getComponentBase((_a = Context === null || Context === void 0 ? void 0 : Context.current) === null || _a === void 0 ? void 0 : _a.components, _field)).content) === null || _c === void 0 ? void 0 : _c.call(_b, _field);
        }
    }
    var render = function (fields) {
        return (fields.filter(function (e) { return e.visible != false; }).map(function (field, index) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var componentBaseField = _getComponentBase((_a = Context === null || Context === void 0 ? void 0 : Context.current) === null || _a === void 0 ? void 0 : _a.components, field);
            var fieldComponent = field.wrap ? field.wrap(getFieldComponent(field)) : getFieldComponent(field);
            return !props.children ? ((0, react_1.createElement)(Context.current.ComponentWrap, __assign({}, (!!field.fields ? configRow : {}), { xs: field.xs, "xs-m": field['xs-m'], sm: field.sm, "sm-m": field['sm-m'], md: field.md, "md-m": field['md-m'], lg: field.lg, "lg-m": field['lg-m'], xl: field.xl, "xl-m": field['xl-m'], order: field.order, key: field.name || field.key || index }, componentBaseField === null || componentBaseField === void 0 ? void 0 : componentBaseField.contentProps, (_b = props.grid) === null || _b === void 0 ? void 0 : _b.col, field.contentProps, { style: __assign(__assign(__assign({}, (_d = (_c = props.grid) === null || _c === void 0 ? void 0 : _c.col) === null || _d === void 0 ? void 0 : _d.style), (_e = componentBaseField === null || componentBaseField === void 0 ? void 0 : componentBaseField.contentProps) === null || _e === void 0 ? void 0 : _e.style), (_f = field.contentProps) === null || _f === void 0 ? void 0 : _f.style), className: ['form-field', (_g = componentBaseField === null || componentBaseField === void 0 ? void 0 : componentBaseField.contentProps) === null || _g === void 0 ? void 0 : _g.className, (_h = field.contentProps) === null || _h === void 0 ? void 0 : _h.className].filter(Boolean).join(' ') }),
                field.beforeContent,
                fieldComponent,
                field.afterContent)) : fieldComponent;
        }));
    };
    //---------------------------------------------- COMPONENTE -------------------------------------
    return ((0, jsx_runtime_1.jsx)(utils_1.Context.Provider, __assign({ value: argumentsToContexts }, { children: (0, jsx_runtime_1.jsx)("form", __assign({ onSubmit: submit, ref: form }, { children: props.children ? connectChildren(props.children(argumentsToContexts)) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Context.current.ComponentWrap, __assign({}, configRow, (_e = props.grid) === null || _e === void 0 ? void 0 : _e.row, { children: render(fields) })), !props.hiddenFooter && (props.beforeButtonElement || props.onSubmit || props.afterButtonElement) &&
                        (0, jsx_runtime_1.jsxs)(Context.current.ComponentWrap, __assign({ row: true, alignItems: 'flex-start', justify: 'flex-end', className: 'content-buttons', style: { marginTop: 20 } }, (_f = Context === null || Context === void 0 ? void 0 : Context.current) === null || _f === void 0 ? void 0 : _f.footerProps, { children: [props.beforeButtonElement, props.onSubmit && ((_g = Context === null || Context === void 0 ? void 0 : Context.current) === null || _g === void 0 ? void 0 : _g.button), props.afterButtonElement] }))] })) })) })));
};
var create = function (data) { return (0, react_2.forwardRef)(Form.bind(data)); };
exports.create = create;
exports.default = Form;
