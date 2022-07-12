import React, {useMemo} from 'react'
import type { Field } from '../types';
import { getFlatFields } from '../utils';

export default function useMemoizedAllFields(fields, values){
    const allFields: Array<Field> = useMemo(() => {
        fields = fields || [];
        if(!fields) {
            fields = Object.entries(values || {}).map(e => ({name: e[0]}))
        }
        return getFlatFields(fields)
    }, [fields, values])

    return allFields
}