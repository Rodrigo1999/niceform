import React, { useEffect, useMemo, useState } from 'react';
import { Field, ValueKeys } from '../types';
import { ReturnUseValuesFunction, UseValuesFunctionParams } from '../types/hooks';
import { getAllFields, resolveInitialValue, resolveValue } from '../utils';

function callbackGetAllFields(fields, initialValues){
    let _fields = fields || [];
    if(!fields) {
        _fields = Object.entries(initialValues || {}).map(e => ({name: e[0]}))
    }
    return getAllFields(_fields)
}
export default function useValues({fields, initialValues}: UseValuesFunctionParams<Field>) : ReturnUseValuesFunction<Field>{
    let [values, setValues] = useState({});
    let allFields: Array<Field> = useMemo(() => callbackGetAllFields(fields, initialValues), [fields, initialValues])
    //---------------------------------------------- seta o valor inicial do formulário -------------------------------------
    let setInitialValues = () => {
		let fieldsActives =  allFields.filter(e => e.active != false);
        let _values = Object.assign({}, initialValues);
        
		if(_values){
            let valuesCloned = Object.assign({}, values);
            
			fieldsActives.forEach(e => {
			  	if(e.name && e.input){
				    _values[e.name] = e.input(_values[e.name]);
			  	}
			});
            resolveInitialValue(_values, valuesCloned)
            
			setValues(valuesCloned);
		}
    }
    
    //---------------------------------------------- altera o valor de um determinado campo -------------------------------------
    let changeValue = (name: any, val: any, cb?: Function) => {

        let fd = fields ? allFields.find(e => e.active != false && e.name == name) : undefined
        
        setValues((values: ValueKeys) => {
            if(fd && fd.dependence){
                let dependence = fd.dependence?.split?.('-');
                allFields.forEach(e => {
                    if(!e.dependence) return false;
                    let thisDependence = e.dependence.split('-');
                    if(dependence[0] == thisDependence[0] && parseInt(thisDependence[1]) > parseInt(dependence[1])){
                        if(e.name) resolveValue(values, e.name, undefined, true)
                    }
                });
            }
            resolveValue(values, name, val);
            return {...values}
        });
        cb?.(fd, val);
    }

    //---------------------------------------------- limpesa do formulário-------------------------------------
    let cleanValues = () => {
        let fd = allFields.filter(e => e.active != false);
        setValues(values => {
            for (let index = 0; index < fd.length; index++) {
                const element = fd[index];
                if(element.name) resolveValue(values, element.name, undefined, true)
            }
            return {...values}
        });
    }

    //---------------------------------------------- inicialização -------------------------------------
    useEffect(() => {
        setInitialValues();
    }, [initialValues])

    return {values, cleanValues, setValues, setInitialValues, changeValue};
}