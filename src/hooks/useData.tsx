import React from 'react'

export default function useData(...data){
    let collector = React.useRef(null as any)

    collector.current = callback => callback(...data) 

    return (cb) => collector.current(cb)
}