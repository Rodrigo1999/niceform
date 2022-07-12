import React from 'react';
import { Create, ParamsCreate, Props } from '../types';
declare let Form: (props: Props, ref: any) => JSX.Element;
export declare const create: (data: (params: ParamsCreate) => Create) => React.ForwardRefExoticComponent<Pick<Props, "fields" | "wrap" | "enableDebounce" | "timeDebounce" | "staticFields" | "onSubmit" | "initialValues" | "onChangeField" | "onBeforeSubmit" | "validationSchema" | "create" | "children" | "fixedValues" | "beforeButtonElement" | "afterButtonElement" | "hiddenFooter" | "formData" | "clean" | "grid" | "direction" | "justify" | "align" | "alignItems" | "spacing"> & {
    [x: string]: any;
}>;
export default Form;
