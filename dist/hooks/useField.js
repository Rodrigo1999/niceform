"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var useDebounce_1 = __importDefault(require("./useDebounce"));
var memoization_1 = require("./memoization");
var utils_1 = require("../utils");
/**
 * Hook that works on top of the informed field
 * @param name - Field name
 * @returns object
 */
function useField(name) {
    var getData = react_1.default.useContext(memoization_1.FieldContext);
    var getDataField = (0, utils_1.useContextSelector)(function (state) { return state.getDataField; });
    var _getData = function () { return (typeof getData === 'function' ? getData() : {}); };
    var _name = _getData().name;
    var error = (0, utils_1.useContextSelector)(function (state) { return state.errors[_name || name]; });
    var verifyAllErrors = (0, utils_1.useContextSelector)(function (state) { return state.verifyAllErrors; });
    var _a = useDebounce_1.default.bind(getData)(_name || name), value = _a[0], changeValue = _a[1];
    return {
        /**
         * Field name (Useful when using the memoization hook).
         */
        name: _name || name,
        /**
         * Field value
         *
         * @example
         *
         * function TextField(props){
                const {value} = useField(props.name)
                return (
                    <input name={props.name} value={value}/>
                )
            }
         */
        value: value,
        /**
         * With this function we can change the value of a certain form field.
         *
         * @example
         *
         * function TextField(props){
                const {value, changeValue} = useField(props.name)
                return (
                    <input name={props.name} value={value} onChange={changeValue}/>
                )
            }
         */
        changeValue: changeValue,
        /**
         * Returns field data, those passed as props in your field component configuration or coming from the assembly JSON,
         * getDataField is not reactive, so if you prefer to do some action and need a certain attribute informed in the JSON
         * you can use this service to extract this information.
         *
         * @example
         *
         * function TextField(props){
                const { ..., getDataField } = useField(props.name)
                return (
                    <>
                        <input name={props.name} {...}/>
                        <button onClick={() => console.log(getDataField())}>click</button>
                        {/*the click event will return a JSON with all the attributes you entered.\/*}
                    </>
                )
            }
         */
        getDataField: (function () { return getDataField(_getData().name || name); }),
        /**
         * Clear the form field.
         *
         * @example
         *
         * function TextField(props){
                const { value, changeValue, clean } = useField(props.name)
                return (
                    <>
                        <input name={props.name} value={value} onChange={changeValue}/>
                        <button onClick={() => console.log(clean())}>click</button>
                    </>
                )
            }
         */
        clean: (function (val) { return changeValue(val !== null && val !== void 0 ? val : ''); }),
        /**
         * If the field contains validation errors, it will be returned in this attribute.
         *
         * @example
         *
         * function TextField(props){
                const { erro } = useField(props.name)
                return (
                    <>
                        <input name={props.name} {...}/>
                        {!!error ? <small style={{color: 'red'}}>{error}</small> : null}
                    </>
                )
            }
         */
        error: error,
        /**
         * Revalidates field errors.
         *
         * @example
         *
         * function TextField(props){
                const { erro, verifyError } = useField(props.name)
                return (
                    <>
                        <input name={props.name}/>
                        {!!error ? <small style={{color: 'red'}}>{error}</small> : null}
                        <button onClick={() => verifyError()}>click</button>
                    </>
                )
            }
         */
        verifyError: (function () { return verifyAllErrors(_getData().name || name); })
    };
}
exports.default = useField;
