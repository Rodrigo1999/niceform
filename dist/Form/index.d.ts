import React from 'react';
import { Create, ParamsCreate, Props } from '../types';
declare let Form: (props: Props, ref: any) => JSX.Element;
export declare let create: (data: (params: ParamsCreate) => Create) => React.ForwardRefExoticComponent<Props & {
    [x: string]: any;
}>;
export default Form;
