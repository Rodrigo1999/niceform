import React from 'react';
import useData from './useData';

function getFilterObject(obj: Object, arrayKeys: Array<string> | boolean) {
    let keys = Object.keys(obj)
    let objInclude = {}
    let objExclude = {}

    if (Array.isArray(arrayKeys)) {
        keys.forEach(key => {
            if (arrayKeys.includes(key)) objInclude[key] = obj[key]
            else objExclude[key] = obj[key]
        })

        return { objInclude, objExclude }
    } else {
        if (arrayKeys) objInclude = obj
        else objExclude = obj
        return { objInclude, objExclude }
    }
}

const FieldContext = React.createContext({})

export {FieldContext}

export default function memoization<T>(Component) {

    return function (props) {
        const [key, update] = React.useReducer(() => Math.random(), 0)

        let obj = getFilterObject(props, props.otimization)
        const _getData = useData(obj.objInclude)

        const getData = React.useCallback(_getData, []) as () => T

        return (
            <FieldContext.Provider value={getData} key={key}>
                <Component {...obj.objExclude} getData={getData} update={update}/>
            </FieldContext.Provider>
        )
    }
}