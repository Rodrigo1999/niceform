import React, { useEffect, useMemo, useState } from 'react';
import type { Field, ValueKeys } from '../types';
import type { ReturnUseValuesFunction, UseValuesFunctionParams } from '../types/hooks';
import { resolveInitialValue, resolveValue, getValuesByKeyRange } from '../utils';
import useData from './useData'
import useMemoizedAllFields from './useMemoizedAllFields'

export default function useValues({fields, initialValues}: UseValuesFunctionParams<Field>) : ReturnUseValuesFunction<Field>{
    
    let allFields = useMemoizedAllFields(fields, initialValues)

    const [values, setValues] = useState(initialValues ? Object.fromEntries(Object.entries(initialValues).map(([key,]) => [key, undefined])) : {})

    const getStates = useData<UseValuesFunctionParams<Field> & {allFields: typeof allFields, values: typeof values}>({
        fields, 
        initialValues, 
        values, 
        allFields
    })

    const actions = useMemo(() => ({
        //---------------------------------------------- seta o valor inicial do formulário -------------------------------------
        setInitialValues(){
            const {initialValues, allFields, values} = getStates()
            
            let fieldsActives =  allFields.filter(field => field.active != false);
            
            let _values = Object.assign({}, initialValues);
            
            if(_values){
                let valuesCopied = Object.assign({}, values)
                
                fieldsActives.forEach(field => {
                    if(field.name && field.input){
                        _values[field.name] = field.input(_values[field.name])
                    }
                })

                resolveInitialValue(_values, valuesCopied)
                setValues(valuesCopied)
            }
        },
        //---------------------------------------------- altera o valor de um determinado campo -------------------------------------
        changeValue(name: any, val: any, callback?: Function){
            
            const {fields, allFields} = getStates()
        
            const field = fields ? allFields.find(e => e.name == name) : undefined
            
            if(field?.active !== false){
                setValues((values: ValueKeys) => {                    
                    if(field?.dependence){
                        let dependence = field.dependence?.split?.('-');
                        for(let field of allFields){
                            if(!field.dependence || !field.name) continue
                            let thisDependence = field.dependence.split('-')
                            if(dependence[0] == thisDependence[0] && parseInt(thisDependence[1]) > parseInt(dependence[1])){
                                resolveValue(values, field.name, undefined, true)
                            }
                        }
                    }
                    
                    resolveValue(values, name, val);
                    return {...values}
                })
            }
            
            callback?.(field, val) 
        },
        //---------------------------------------------- limpesa do formulário-------------------------------------
        cleanValues(){
            const {allFields} = getStates()
           
            const fields = allFields.filter(e => e.active != false);
            setValues(values => {
                for(let field of fields){
                    if(field.name) resolveValue(values, field.name, undefined, true)
                }
                return {...values}   
            })
        }
    }), [])

    //---------------------------------------------- inicialização -------------------------------------
    useEffect(() => {
        if(Object.values(initialValues || {}).length) actions.setInitialValues()
    }, [initialValues])

    return {
        values, 
        cleanValues: actions.cleanValues, 
        setInitialValues: actions.setInitialValues, 
        changeValue: actions.changeValue, 
        setValues, 
        valuesChain: useMemo(() => getValuesByKeyRange(values), [values])
    }
}