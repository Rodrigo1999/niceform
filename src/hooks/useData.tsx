import React from 'react'

export default function useData<T>(data: T): () => T{
    let collector = React.useRef<any>(null)

    collector.current = () => data

    return () => collector.current()
}