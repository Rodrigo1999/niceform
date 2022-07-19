import React from 'react';
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
export default function useDebounce(name: string, callback?: Function): readonly [any, (foo: React.ChangeEvent<HTMLInputElement> | any, bar?: any) => void];
