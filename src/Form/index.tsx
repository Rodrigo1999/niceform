import Grid from 'dynamic-react-grid';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import useErrors from '../hooks/useErrors';
import useValues from '../hooks/useValues';
import { Create, Field, ParamsCreate, Props } from '../types';
import { getAllFields, getComponentBase, objectToForm, dequal, filterProperty } from '../utils';

// let Form: React.ForwardRefRenderFunction<HTMLFormElement, Props & JSX.IntrinsicElements['form']> = function (props, ref) {
let Form = function (props: Props, ref) {

    let Context = useRef<Create>({
        errorsControl: [],
        components: [],
        onError: () => null,
        ComponentWrap: Grid,
        button: undefined,
        footerProps: {},
        context: {}
    });
    props = {...Context.current.context, ...props}
    let lastChangedField = useRef([] as ([name: any, value: any] | []))
    let isSubmited = useRef(false)
    let form = useRef<HTMLFormElement>(null);
    let fieldsFromChildren = useRef<Array<Field>>([]);

    let fields = props.fields?.concat?.(props.staticFields || [])

    let hookValues = useValues({
        fields: (fields || []).concat(fieldsFromChildren.current.length ? fieldsFromChildren.current : []),
        initialValues: useMemo(() => Object.assign({}, props.initialValues, props.fixedValues), [props.initialValues, props.fixedValues])
    });

    let hookErrors = useErrors({
        fields: (fields || []).concat(fieldsFromChildren.current.length ? fieldsFromChildren.current : []).filter(e => e.active != false),
        values: hookValues.values,
        errorsControl: Context?.current?.errorsControl,
        yupSchema: props.validationSchema
    });

    useEffect(() => {
        if(lastChangedField.current[0] && isSubmited.current){
            hookErrors.verifyAllErrors(lastChangedField.current[0])
        }
    }, [hookValues.values, isSubmited])

    //---------------------------------------------- ações básicas -------------------------------------
    let actions = useMemo(() => ({
        clean() {
            hookValues.cleanValues();
            isSubmited.current = false
        },
        changeValue(evt: React.ChangeEvent<HTMLInputElement> | string, value?: any, others?: any) {
            let _name = '';
            let _value: any;
            if (typeof evt == 'string') {
                _name = evt;
                _value = value
            } else {
                _name = evt.target.name;
                _value = evt.target.value
            }

            const fd = getAllFields(props?.fields || []).find(e => e.name == _name && e.active === false)

            hookValues.changeValue(_name, _value, function (field, value) {
                lastChangedField.current = [_name, _value]
                props.onChangeField?.(field || fd, value, others)
            });
        }
    }), [JSON.stringify(fieldsFromChildren.current)])
    
    //---------------------------------------------- submição de formulário -------------------------------------
    let submit = async (evt) => {
        evt?.preventDefault?.();
        isSubmited.current = true;
        let errors = await hookErrors.verifyAllErrors()
        let cloneValues = Object.assign({}, hookValues.values);

        if(fields){
            let fd: Array<Field> = getAllFields(fields).filter(field => field.active != false);
            fd.filter(e => e.output && e.visible != false).forEach(e => {
                if (e.name) cloneValues[e.name] = e.output!(hookValues.values[e.name]);
            });
        }

        props.onBeforeSubmit?.(cloneValues);
        if (!!Object.values(errors).length) {
            Context?.current?.onError?.(errors);
            return false;
        } else {
            if (props.formData) {
                cloneValues = objectToForm(cloneValues);
            }
            props.onSubmit?.(cloneValues);
            if (props.clean) hookValues.cleanValues();

            return true;
        }
    }

    // -------------------------------------------- renderização flúida de um componente-----------------------
    function renderField(obj: Field){
        let field = fieldsFromChildren.current.find(e => e.name==obj.name)
        if(!field){
            fieldsFromChildren.current.push(obj)
        }else if(!dequal(field, obj)){
            fieldsFromChildren.current = fieldsFromChildren.current.map(e => e.name==obj.name ? obj : e)
        }
        return render([obj])[0]
    }

    //---------------------------------------------- inicialização ---------------------------------------------
    let argumentsToContexts = {
        props,
        errors: hookErrors.errors,
        values: hookValues.values,
        valuesChain: hookValues.valuesChain,
        verifyAllErrors: hookErrors.verifyAllErrors,
        changeValue: actions.changeValue,
        submit,
        clean: actions.clean,
        allFields: fields ? getAllFields(fields) : [],
        renderField
    }

    let localContext: Create = this?.(argumentsToContexts) || {};
    let propsContext: Partial<Create> = props.create?.(argumentsToContexts) || {}

    Context.current = {
        errorsControl: propsContext.errorsControl || localContext.errorsControl || [],
        components: propsContext.components || localContext.components || [],
        onError: propsContext.onError || localContext.onError || (() => null),
        ComponentWrap: propsContext.ComponentWrap || localContext.ComponentWrap || Grid,
        button: propsContext.button || localContext.button,
        footerProps: propsContext.footerProps || localContext.footerProps,
        context: propsContext.context || localContext.context,
    }
    
    
    //---------------------------------------------- controle de referência -------------------------------------

    useImperativeHandle(
        Object.keys(props.innerRef || ref || {}).length ? props.innerRef || ref : { current: null }, 
        () => ({...argumentsToContexts, form: form?.current, setValues: hookValues.setValues})
    );

    //---------------------------------------------- controle de linhas e colunas -------------------------------------

    let configRow = {
        row: true,
        alignItems: props.alignItems || 'flex-start',
        justify: props.justify,
        align: props.align,
        direction: props.direction,
        spacing: props.spacing || 2,
    }
    function wrapChildren(f: Field) {
        if(fields || props.children){
            if (f.fields) return render(f.fields);
            if (f.type == 'component' && f.content) return f.content({...argumentsToContexts, fields: fields || []});

            let _f = filterProperty(f, ['input', 'output'])
            return (getComponentBase(Context?.current?.components, _f) || getComponentBase(Context?.current?.components, _f, 'default'))?.content?.(_f);
        }
    }
    let render = (fields) => {
        return (
            fields.filter(e => e.visible != false).map((field, index) => {
                let componentBaseField = getComponentBase(Context?.current?.components, field) || getComponentBase(Context?.current?.components, field, 'default');
                return !props.children ? (
                    <Context.current.ComponentWrap
                        {...(!!field.fields ? configRow : {})}
                        xs={field.xs}
                        xs-m={field['xs-m']}
                        sm={field.sm}
                        sm-m={field['sm-m']}
                        md={field.md}
                        md-m={field['md-m']}
                        lg={field.lg}
                        lg-m={field['lg-m']}
                        xl={field.xl}
                        xl-m={field['xl-m']}
                        order={field.order}
                        key={field.name || index}
                        {...componentBaseField?.contentProps}
                        {...props.grid?.col}
                        {...field.contentProps}
                        style={{
                            ...props.grid?.col?.style,
                            ...componentBaseField?.contentProps?.style,
                            ...field.contentProps?.style,
                        }}
                        className={['form-field', componentBaseField?.contentProps?.className, field.contentProps?.className].filter(Boolean).join(' ')}
                    >
                        {field.beforeContent}
                        {field.wrap ? field.wrap(wrapChildren(field)) : wrapChildren(field)}
                        {field.afterContent}
                    </Context.current.ComponentWrap>
                ) : field.wrap ? field.wrap(wrapChildren(field)) : wrapChildren(field)
                    
                
            })
        )
    }

    //---------------------------------------------- COMPONENTE -------------------------------------
    return (
        <form onSubmit={submit} ref={form}>
            {props.children ? props.children(argumentsToContexts) : (
                <>
                    <Context.current.ComponentWrap
                        {...configRow}
                        {...props.grid?.row}
                    >
                        {render(fields)}
                    </Context.current.ComponentWrap>
                    {!props.hiddenFooter && (props.beforeButtonElement || props.onSubmit || props.afterButtonElement) &&
                        <Context.current.ComponentWrap
                            row
                            alignItems='flex-start'
                            justify='flex-end'
                            className='content-buttons'
                            style={{marginTop: 20}}
                            {...Context?.current?.footerProps}
                        >
                            {props.beforeButtonElement}
                            {props.onSubmit && Context?.current?.button}
                            {props.afterButtonElement}
                        </Context.current.ComponentWrap>

                    }
                </>
            )}
        </form>
    )
}

export let create = (data: (params: ParamsCreate) => Create) => (forwardRef(Form.bind(data)) as React.ForwardRefExoticComponent<React.PropsWithoutRef<Props> & {[x:string]: any}>);
export default Form;