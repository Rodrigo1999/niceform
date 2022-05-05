import React from 'react';
import dequal from './dequal'

const CONTEXT_VALUE = Symbol();

interface Ref<Value>{
    [CONTEXT_VALUE]: {
        listeners: Set<(ctx: any) => void>,
        id: number,
        value: Value
    }
}

interface Provider<Value>{
    Provider: React.ComponentType<{ value: Value; children: React.ReactNode }>
}

function createProvider<Value>(Provider){
    return function CreateProvider({value, children}: {value: Value, children: React.ReactNode}){
        const ref = React.useRef<Ref<Value> | null>(null)
        
        if(!ref.current){
            ref.current = {
                [CONTEXT_VALUE]: {
                    listeners: new Set(),
                    id: Math.random(),
                    value
                }
            }
        }

        React.useEffect(() => {
            if(ref.current)
            ref.current[CONTEXT_VALUE].listeners.forEach(callback => {
                callback(value)
            })
        }, [value])

        return React.createElement(Provider, {value: ref.current}, children)
    }
}

export function createContext<Value>(value){
    const context = React.createContext<Ref<Value> | any>({
        [CONTEXT_VALUE]: {
            listeners: new Set(),
            id: Math.random(),
            value
        }
    });
    (context as Provider<Value>).Provider = createProvider(context.Provider)
    return context
}

export const Context = createContext({})

export function useContext(){
    return useContextSelector(e => e)
}
export function useContextSelector<Value>(callback: (value: Value) => any){
    const context = React.useContext(Context as React.Context<Ref<Value>>)[CONTEXT_VALUE]

    const [value, checkUpdate] = (React as any).useReducer((state, ctx) => {
        const data = callback(ctx || context.value)
        
        if(!dequal(state, data)){
            return data
        }

        return state
    }, callback(context.value))

    React.useEffect(() => {
        context.listeners.add(checkUpdate)
        return function(){
            context.listeners.delete(checkUpdate)
        }
    }, [])

    return value
}