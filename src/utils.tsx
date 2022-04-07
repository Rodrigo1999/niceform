import React from 'react';
import { Field, Components } from './types';
export {default as dequal} from './dequal'
//---------------------------------------------- serializa os valores do formulário para formData-------------------------------------
export function objectToForm(obj: Object, form?: any, level?: any) {
    let f = form || new FormData();
    for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
            let levelProp = level ? level + '[' + k + ']' : k;
            // If it is a date, it parses to ISO format
            if (obj[k] instanceof Date) {
                f.set(levelProp, obj[k].toISOString());
                continue;
            }
            else if (obj[k] === null || obj[k] === undefined) {
                f.set(levelProp, '');
                continue;
            }
            else if (typeof obj[k] === 'object' && !(obj[k] instanceof File) && !(obj[k] instanceof Blob)) {
                objectToForm(obj[k], f, levelProp);
                continue;
            }
            f.set(levelProp, obj[k]);
        }
    }
    return f;
}
//---------------------------------------------- debounce -------------------------------------
export function debounce(fn, ms) {
    let timer: any = 0
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

//---------------------------------------------- retorna todos os campos -------------------------------------
export function getAllFields(fields: Array<Field>): Array<Field> {
    return fields.flatMap((field) => field.fields ? getAllFields(field.fields) : field);
}
//---------------------------------------------- retorna todos um campo específico ---------------------------
export function getField(fields: Array<Field>, name: string, active: Boolean): Field | undefined {
    let allFields = getAllFields(fields);
    let field = allFields;
    if (active) field = field.filter(e => e.active != false);
    return field.find(e => e.name == name);
}
//---------------------------------------------- retorna ou insere um valor a partir de uma cadeia de objetos ---------------------------
export function resolveValue(obj: Object, prop: String, val?: any, valueIsUndefined?: Boolean) {
    if (typeof obj === 'undefined') return
    prop = prop.replace(/(\[\d+\])/g, '.$1').replace(/\[|]/g, '')
    let arr = prop.split('.');

    return arr.reduce(function (prev, curr, i) {
        let last = arr.length - 1 == i;
        if (!prev[curr] && !last) {
            if (!isNaN(parseInt(arr[i + 1]))) {
                prev[curr] = []
            } else {
                prev[curr] = {}
            }
        }
        if (last && (val !== undefined || valueIsUndefined)) prev[curr] = val;
        return prev[curr]
    }, obj)
}
//---------------------------------------------- transforma um objeto em uma cadeia de objeto ---------------------------
export function getValuesByKeyRange(values: Object) {
    let arrValues: Array<any> = []
    function getKeysRange(obj) {
        let entries = Object.entries(obj)
        let map = entries.map((e: Array<any>) => {
            if (typeof e[1] == 'object') {
                return getKeysRange(e[1]).map(n => `${e[0]}.${n}`)
            } else {
                arrValues.push(e[1])
                return e[0]
            }
        })
        return map.flatMap(e => e)
    }
    return getKeysRange(values || {}).reduce((obj, e, i) => {
        obj[e] = arrValues[i]
        return obj;
    }, {})
}
//---------------------------------------------- resolve valores iniciais já pré definidos ---------------------------
export function resolveInitialValue(values: Object, valuesCloned: Object) {
    Object.keys(values).forEach(k => {
        if (typeof valuesCloned[k] == 'object') resolveInitialValue(values[k], valuesCloned[k])
        if (valuesCloned[k] === undefined) {
            valuesCloned[k] = values[k]
        }
    });
}
//---------------------------------------------- Tratativa melhor de erros ---------------------------
export function _try(promisse): Promise<[error: any, result: any]> {
    return promisse.then(result => [null, result]).catch(error => [error])
}
//---------------------------------------------- tratativa do schema com yup ---------------------------
export async function errorSchema(schema: any, fields: Array<Field>, values: Object, basic?: Boolean, omit?: Boolean): Promise<Array<Object> | undefined> {
    let omitSchema: Array<String> = [];
    if(omit){
        let arrFieldsKey: Array<String> = fields.map(e => e.name || '')
        let arrFieldsSchema: Array<String> = Object.keys(schema.fields);
        omitSchema = arrFieldsSchema.filter(e => !arrFieldsKey.includes(e));
    }
    if (!schema?.validate) return
    let fieldsToKeyValue;
    if(basic){
        fieldsToKeyValue = getValuesByKeyRange(values);
    }else{
        fieldsToKeyValue = fields.reduce((obj, e) => {
            if (e.name !== undefined) obj[e.name] = resolveValue(values, e.name)
            return obj
        }, {})
    }
    
    let [error] = await _try(schema.omit(omitSchema).validate(fieldsToKeyValue, { abortEarly: false }))
    if (error) return error.inner.reduce((obj, error) => {
        obj[error.path.replace(/^\[|]$/g, '')] = error.message;
        return obj;
    }, {})
}

export async function validateSchemaOnlyField(schema: any, value: Object) {
    if (!schema?.validate) return
    let [error] = await _try(schema.validate(value))
    if (error) return error.message
}
//---------------------------------------------- retorna o componente de campo correspondente a seu type ---------------------------
export function getComponentBase(components, field: Field, type?: any) {
    return components.find((component: Components) => {
        if (type || field.type) return ([] as string[]).concat(component.type).includes(type || field.type);
    })
}

//---------------------------------------------- filter Properties ---------------------------

export function filterProperty(_obj: object, filter?: Array<string> | ((value: Array<any>, index: number, arr: Array<Array<any>>) => boolean)){
  let obj: Array<Array<any>> = Object.entries(_obj)
  if(Array.isArray(filter)){
    obj = obj.filter(e => !filter.includes(e[0]))
  }else if(filter){
    obj = obj.filter(filter)
  }
  obj = Object.fromEntries(obj)
  return obj
}