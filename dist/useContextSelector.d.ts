import React from 'react';
export declare function createContext<Value>(value: any): React.Context<any>;
export declare const Context: React.Context<any>;
export declare function useContext(): any;
export declare function useContextSelector<Value>(callback: (value: Value) => any): any;
