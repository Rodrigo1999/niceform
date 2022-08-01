export interface UseValuesFunctionParams<Fields>{
    fields?: Array<Fields>, 
    initialValues?: Object
}
export interface ReturnUseValuesFunction<Fields>{
    values: Object, 
    valuesChain: Object, 
    setValues: Function,
    cleanValues: () => void, 
    setInitialValues: () => void,
    changeValue: (name: any, val: any, callback?: (field: Fields, value: any) => void, basic?: boolean) => void
}

type useErrorsFunctionParamsReturn = string | Boolean | undefined | void

export type errorsControl<Fields> = Array<({field, value, validateSchema}:{
    field: Fields, 
    value: any, 
    validateSchema: (schema: any) => Promise<any>
}) => useErrorsFunctionParamsReturn | Promise<useErrorsFunctionParamsReturn>>
export interface useErrorsFunctionParams<Fields>{
    fields?: Array<Fields>, 
    yupSchema?: any, //item
    getErrorsControl?: () => errorsControl<Fields>,
    values: Object
}
export interface ReturnUseErrorsFunctionParams{
    errors: Object, 
    verifyAllErrors: (name?: string, value?: any) => Object,
    cleanErrors: Function
}