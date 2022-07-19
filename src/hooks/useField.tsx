import React from 'react'
import useDebounce from './useDebounce'
import { FieldContext } from './memoization'
import { useContextSelector } from '../utils'
import { ParamsCreate, Field } from '../types'

/**
 * Returns JSON data from a given field
 */
type getDataField = (name: string) => Field & { [key: string]: any }

/**
 * Hook that works on top of the informed field
 * @param name - Field name
 * @returns object
 */
export default function useField(name) {
    const getData = React.useContext(FieldContext) as () => { [key: string]: any }
    const getDataField: getDataField = useContextSelector<ParamsCreate & { getDataField }>(state => state.getDataField)
    const _getData = () => (typeof getData === 'function' ? getData() : {} as { [key: string]: any })

    let { name: _name } = _getData()

    const error = useContextSelector<ParamsCreate>(state => state.errors[_name || name])
    const verifyAllErrors = useContextSelector<ParamsCreate>(state => state.verifyAllErrors)

    const [value, changeValue] = useDebounce.bind(getData)(_name || name)

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
        value,
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
        changeValue,
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
        getDataField: (() => getDataField(_getData().name || name)) as () => ({ [key: string]: any }),
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
        clean: ((val) => changeValue(val ?? '')) as () => void,
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
        error,
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
        verifyError: (() => verifyAllErrors(_getData().name || name)) as () => string | any
    }
}