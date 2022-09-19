import React from 'react';
import { Create, ParamsCreate, Props } from '../types';
declare let Form: (props: Props, ref: any) => JSX.Element;
export declare const create: (data: (params: ParamsCreate) => Create) => React.ForwardRefExoticComponent<Pick<Props, "order" | "fields" | "wrap" | "enableDebounce" | "timeDebounce" | "staticFields" | "onSubmit" | "initialValues" | "onChangeField" | "onBeforeSubmit" | "validationSchema" | "create" | "children" | "row" | "direction" | "justify" | "alignContent" | "align" | "spacing" | "spacingY" | "spacingX" | "self" | "fixedValues" | "beforeButtonElement" | "afterButtonElement" | "hiddenFooter" | "formData" | "clean" | "grid" | "xs" | "xs-m" | "sm" | "sm-m" | "md" | "md-m" | "lg" | "lg-m" | "xl"> & {
    [x: string]: any;
}>;
export default Form;
