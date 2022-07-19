/**
 * Hook that works on top of the informed field
 * @param name - Field name
 * @returns object
 */
export default function useField(name: any): {
    /**
     * Field name (Useful when using the memoization hook).
     */
    name: any;
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
    value: any;
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
    changeValue: (foo: any, bar?: any) => void;
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
    getDataField: () => {
        [key: string]: any;
    };
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
    clean: () => void;
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
    error: any;
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
    verifyError: () => string | any;
};
