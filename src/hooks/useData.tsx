import React from 'react'

export default function useData<T>(data){
    let collector = React.useRef(null as any)

    collector.current = () => data

    return () => collector.current() as T
}