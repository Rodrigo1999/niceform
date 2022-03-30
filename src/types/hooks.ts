export interface UseValuesFunctionParams<Fields>{
    fields?: Array<Fields>, 
    initialValues?: Object,
    hasChildrenInstance: boolean
}
export interface ReturnUseValuesFunction<Fields>{
    values: Object, 
    setValues: Function,
    cleanValues: () => void, 
    setInitialValues: () => void,
    changeValue: (name: any, val: any, callback?: (field: Fields, value: any) => void, basic?: boolean) => void
}

type useErrorsFunctionParamsReturn = string | Boolean | undefined | void
export interface useErrorsFunctionParams<Fields>{
    fields?: Array<Fields>, 
    yupSchema?: any, //item
    errorsControl?: Array<({field, value, validateSchema}:{
        field: Fields, 
        value: any, 
        validateSchema: (schema: any) => Promise<any>
    }) => useErrorsFunctionParamsReturn | Promise<useErrorsFunctionParamsReturn>>,
    values: Object,
    hasChildrenInstance: boolean
}
export interface ReturnUseErrorsFunctionParams{
    errors: Object, 
    verifyAllErrors: (name?: string) => Object
}