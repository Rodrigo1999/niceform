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
    const time = useContextSelector<ParamsCreate>(state => state.allFields.find(e => e.name==name)?.timeDebounce ?? state.props.timeDebounce) || 200
    const enableDebounce = useContextSelector<ParamsCreate>(state => state.allFields.find(e => e.name==name)?.enableDebounce ?? state.props.enableDebounce) ?? true

    useEffect(() => {
        if(value !== _value) setValue(_value || '')
    }, [_value])

    let onChangeDebounce = useMemo(() => debounce((evt, value, other, cb) => cb(evt, value, other), time), [])

    function changeValue(evt: React.ChangeEvent<HTMLInputElement> | string, value?: any, others?: any) : void
    function changeValue(evt, value, other){
        evt = {...evt, target: evt.target}
        
        if(enableDebounce) onChangeDebounce(evt, value, other, callback || _changeValue)
        else _changeValue(evt, value, other)

        if(typeof evt !== 'string') setValue(evt.target.value)
        else setValue(value)
    }
    return [value, changeValue] as const
}