import React, {useState, useMemo, useEffect} from 'react'
import {debounce} from '../utils'
import {useContextSelector} from '../utils'
import {ParamsCreate} from '../types'
/**
 * 
 * @example 
 * export default memo(({
    name,
    changeValue
}) => {

    const [value, onChange] = useDebounce(name[, callback]) // callback is default changeValue

    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            ...
        />
    )
})
 */
export default function useDebounce(name: string, callback?: Function){
    
    const [value, setValue] = useState('')
    const _value = useContextSelector<ParamsCreate>(state => state.valuesChain[name])
    const _changeValue = useContextSelector<ParamsCreate>(state => state.changeValue)
    const time = useContextSelector<ParamsCreate>(state => state.allFields.find(e => e.name==name)?.timeDebounce ?? state.props.timeDebounce) || 400
    const enableDebounce = useContextSelector<ParamsCreate>(state => state.allFields.find(e => e.name==name)?.enableDebounce ?? state.props.enableDebounce) ?? true

    useEffect(() => {
        if(enableDebounce) if(value !== _value) setValue(_value || '')
    }, [_value])

    let onChangeDebounce = useMemo(() => debounce((evt, value, other, cb) => cb(evt, value, other), time), [])

    function changeValue(foo: React.ChangeEvent<HTMLInputElement> | any, bar?: any) : void
    function changeValue(foo, bar){
        
        if(typeof this == 'function') name = this().name

        const value = getValue(foo)
       
        if(enableDebounce) {
            onChangeDebounce(name, value, bar, callback || _changeValue)
            setValue(value)
        } else {
            _changeValue(name, value, bar)
        }        
    }

    return [enableDebounce ? value : _value, changeValue.bind(this)] as const
}

function getValue(foo){
    let value
    if((typeof foo !== 'string') && foo.constructor !== {}.constructor && foo?.target) value = (foo?.target as any)?.value
    else value = foo

    return value
}