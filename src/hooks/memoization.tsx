import React from 'react';
import useData from './useData';
export default function memoization(Component) {

    return function (props) {

        const _getData = useData(props)

        const getData = React.useCallback(_getData, []) as () => object
 
        return <Component getData={getData}/>
    }
}