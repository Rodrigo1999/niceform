import React, { useMemo, useState } from 'react';
import { Field } from '../types';
import { ReturnUseErrorsFunctionParams, useErrorsFunctionParams } from '../types/hooks';
import { errorSchema, getAllFields, resolveValue, validateSchemaOnlyField } from '../utils';

function callbackGetAllFields(fields, values){
    let _fields = fields || [];
    if(!fields) {
        _fields = Object.entries(values || {}).map(e => ({name: e[0]}))
    }
    return getAllFields(_fields)
}

export default function useErrors({fields, errorsControl, yupSchema, values, hasChildrenInstance}: useErrorsFunctionParams<Field>): ReturnUseErrorsFunctionParams{
    let [errors, setErrors] = useState({});
    
    let allFields: Array<Field> = useMemo(() => callbackGetAllFields(fields, values), [fields, values])
    if(hasChildrenInstance) allFields = callbackGetAllFields(fields, values)
    //---------------------------------------------- Retorna os erros encontrados em um campo -------------------------------------
    let verifyErrors = async (field) => {
        let errors = {};

        if(errorsControl){
            for (let index = 0; index < errorsControl.length; index++) {
                const functionReturnPersonError = errorsControl[index];
                
                if(field.name){
                    let value = resolveValue(values, field.name)
                   
                    let err = await functionReturnPersonError({field, value, validateSchema: (schema) => validateSchemaOnlyField(schema, value || '')});
                    if(err) errors[field.name] = err;
                }
            }
        }

        if(field.error){
            let value = resolveValue(values, field.name);
            let err = await field.error({
                fields: allFields, 
                field, 
                values, 
                value,
                validateSchema: (schema) => validateSchemaOnlyField(schema, value || '')
            });
            if(err) errors[field.name] = err;
        }
        
        return errors;
    }
    //---------------------------------------------- salva no estado e retorna os erros encontrados para todos os campos -------------------------------------
    let verifyAllErrors = async (name?: String) => {
        let fd: Array<Field> = [];
        if(name){
            fd = allFields.filter(e => e.active != false && e.name == name);
        }else{
            fd = allFields.filter(e => e.active != false);
        }
        let errors = {}
        let errorYup;
        if(yupSchema){
            errorYup = await errorSchema(yupSchema, fd, values, !fields, !!name)
        }
        
        for (let index = 0; index < fd.length; index++) {
            const field = fd[index];
            if(!field.name) continue
            
            let errorThisField = await verifyErrors(field)
            errors = {...errors, ...errorThisField}
            
        }
        let errorsResult = {...errorYup, ...errors}
        setErrors(errors => {
            let errorsCloned = Object.assign({}, errors)
            fd.forEach(field => {
                if(field.name) delete errorsCloned[field.name];
            })
            if(name && !errors[name.toString()] && !errorsResult[name.toString()]){
                return errors;
            }
            return {...errorsCloned, ...errorsResult}
        })
        return errorsResult;
    }
    return {errors, verifyAllErrors}
}