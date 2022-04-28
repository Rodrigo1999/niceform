import React, { useMemo, useState } from 'react';
import { Field } from '../types';
import { ReturnUseErrorsFunctionParams, useErrorsFunctionParams } from '../types/hooks';
import { errorSchema, getAllFields, validateSchemaOnlyField } from '../utils';

export default function useErrors({fields, errorsControl, yupSchema, values}: useErrorsFunctionParams<Field>): ReturnUseErrorsFunctionParams{
    let [errors, setErrors] = useState({});
    
    let allFields: Array<Field> = useMemo(() => {
        let _fields = fields || [];
        if(!fields) {
            _fields = Object.entries(values || {}).map(e => ({name: e[0]}))
        }
        return getAllFields(_fields)
    }, [fields, values])
    //---------------------------------------------- Retorna os erros encontrados em um campo -------------------------------------
    let verifyErrors = async (field) => {
        let errors = {};

        if(errorsControl){

            for (let functionReturnPersonError of errorsControl) {
                if(field.name){
                    let value = values[field.name]
                   
                    let err = await functionReturnPersonError({field, value, validateSchema: (schema) => validateSchemaOnlyField(schema, value || '')});
                    if(err) errors[field.name] = err;
                }
            }
        }

        if(field.error){
            let value = values[field.name]
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
        
        for (let field of fd) {
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