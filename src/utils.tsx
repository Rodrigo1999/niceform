import React from 'react';
import dequal from './dequal';
import { Field, Components } from './types';
export {default as dequal} from './dequal'
//---------------------------------------------- useReducersHook and evit re render ---------------------------
export * from './useContextSelector'

//---------------------------------------------- utils local ---------------------------
function _try(promisse): Promise<[error: any, result: any]> {
    return promisse.then(result => [null, result]).catch(error => [error])
}
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
export function getFlatFields(fields: Array<Field>): Array<Field> {
    return fields.flatMap((field) => field.fields ? getFlatFields(field.fields) : field);
}
//---------------------------------------------- retorna um campo específico ---------------------------
export function getField(fields: Array<Field>, name: string, active?: Boolean): Field | undefined {
    let allFields = getFlatFields(fields);
    if (active !== undefined) allFields = allFields.filter(e => e.active != active);
    return allFields.find(e => e.name == name);
}
//---------------------------------------------- retorna ou insere um valor a partir de uma cadeia de objetos ---------------------------
export function resolveValue(obj: Object, prop: String, val?: any, valueIsUndefined?: Boolean) {
    if (typeof obj === 'undefined') return
    prop = prop.replace(/(\[\d+\])/g, '.$1').replace(/\[|]/g, '')
    let arr = prop.split('.');

    return arr.reduce(function (prev, curr, i) {
        let last = arr.length == (i + 1);
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
        let entries: Array<any> = Object.entries(obj)
        let map = entries.map(([key, value]) => {
            if (Array.isArray(value) || value?.constructor == ({}).constructor) {
                return getKeysRange(value).map(n => `${key}.${n}`)
            } else {
                arrValues.push(value)
                return key
            }
        })
        return map.flat()
    }
    return getKeysRange(values).reduce((obj, e, i) => {
        obj[e] = arrValues[i]
        return obj;
    }, {})
}
//---------------------------------------------- resolve valores iniciais já pré definidos ---------------------------
export function resolveInitialValue(values: Object, valuesCloned: Object) {
    Object.keys(values).forEach(k => {
        if (Array.isArray(valuesCloned[k]) || valuesCloned[k]?.constructor == ({}).constructor) resolveInitialValue(values[k], valuesCloned[k])
        if (valuesCloned[k] === undefined) {
            valuesCloned[k] = values[k]
        }
    });
}

//---------------------------------------------- tratativa do schema com yup ---------------------------
export async function errorSchema(schema: any, fields: Array<Field>, values: Object, basic?: Boolean, omit?: Boolean): Promise<Array<Object> | undefined> {
    if (!schema?.validate) return
    
    let omitSchema: Array<String> = [];
    if(omit){
        let arrFieldsKey: typeof omitSchema = fields.map(e => e.name || '')
        let arrFieldsSchema: typeof omitSchema = Object.keys(schema.fields);
        omitSchema = arrFieldsSchema.filter(e => !arrFieldsKey.includes(e));
    }
    
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

//---------------------------------------------- Filtro de propriedades ---------------------------

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

//---------------------------------------------- find items by renderField in Dom element ---------------------------

export function findComponentByRenderFieldOnTreeDom(obj: object) {
    const items = Array()
    function each(obj) {
        if (Array.isArray(obj) || obj?.constructor == ({}).constructor) {
            for (let key in obj) {
                if (!(Array.isArray(obj[key]) || obj[key]?.constructor == (new Object).constructor)) continue

                if (obj[key]?.isRenderField) items.push(obj[key])
                each(obj[key])
            }
        }
    }
    each(obj)
    return items.map(e => e.constructorObject).filter(Boolean)
}

//---------------------------------------------- clone object ---------------------------

export function clone(obj) {

    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}