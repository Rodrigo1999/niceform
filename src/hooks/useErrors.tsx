import React, { useMemo, useState } from 'react';
import { Field } from '../types';
import { ReturnUseErrorsFunctionParams, useErrorsFunctionParams } from '../types/hooks';
import { errorSchema, validateSchemaOnlyField } from '../utils';
import useData from './useData'
import useMemoizedAllFields from './useMemoizedAllFields'

export default function useErrors({fields, getErrorsControl, yupSchema, values}: useErrorsFunctionParams<Field>): ReturnUseErrorsFunctionParams{
    let [errors, setErrors] = useState({});
    
    const allFields = useMemoizedAllFields(fields, values)

    const getStates = useData<useErrorsFunctionParams<Field> & {allFields: typeof allFields}>({
        fields, 
        getErrorsControl, 
        yupSchema, 
        values, 
        allFields
    })

    const actions = useMemo(() => ({
        //---------------------------------------------- Retorna os erros encontrados em um campo -------------------------------------
        async verifyErrors(field, _value){
            const {getErrorsControl, values, allFields} = getStates()
                
            const errors = {};

            if(getErrorsControl){

                const errorsControl = getErrorsControl()
                for (let callbackCustomError of errorsControl) {
                    if(!field.name) continue
                
                    let value = _value !== undefined ? _value : values[field.name]
                    
                    let err = await callbackCustomError({field, value, validateSchema: (schema) => validateSchemaOnlyField(schema, value || '')});
                    if(err) errors[field.name] = err;
                }
            }

            if(field.error){
                const value = _value !== undefined ? _value : values[field.name]
                const err = await field.error({
                    fields: allFields, 
                    field, 
                    values, 
                    value,
                    validateSchema: (schema) => validateSchemaOnlyField(schema, value || '')
                });
                if(err) errors[field.name] = err;
            }
            return errors
        },
        //---------------------------------------------- salva no estado e retorna os erros encontrados para todos os campos -------------------------------------
        async verifyAllErrors(name?: String, value?: any) {
            const {fields, yupSchema, values, allFields} = getStates()
                
            let fieldsAccepted: Array<Field> = [];
            if(name){
                fieldsAccepted = allFields.filter(e => e.active != false && e.name == name);
            }else{
                fieldsAccepted = allFields.filter(e => e.active != false);
            }
            let errors = {}
            let errorYup;
            if(yupSchema){
                errorYup = await errorSchema(yupSchema, fieldsAccepted, values, !fields, !!name)
            }
            
            for (let field of fieldsAccepted) {
                if(!field.name) continue
                
                let errorThisField = await actions.verifyErrors(field, value)
                errors = {...errors, ...errorThisField}
                
            }
            let errorsResult = {...errorYup, ...errors}
            setErrors(errors => {
                let errorsCloned = Object.assign({}, errors)
                fieldsAccepted.forEach(field => {
                    if(field.name) delete errorsCloned[field.name];
                })
                if(name && !errors[name.toString()] && !errorsResult[name.toString()]){
                    return errors;
                }
                return {...errorsCloned, ...errorsResult}
            })

            return errorsResult
        },
        //---------------------------------------------- limpa os erros -------------------------------------
        cleanErrors(){
            setErrors({})
        }
    }), [])

    return {
        errors, 
        verifyAllErrors: actions.verifyAllErrors, 
        cleanErrors: actions.cleanErrors
    }
}