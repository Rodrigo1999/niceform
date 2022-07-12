import Grid from 'dynamic-react-grid';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import useErrors from '../hooks/useErrors';
import useValues from '../hooks/useValues';
import useData from '../hooks/useData';
import { Create, Field, ParamsCreate, Props } from '../types';
import { 
    getFlatFields,
    getComponentBase,
    objectToForm,
    dequal,
    filterProperty,
    debounce,
    findComponentByRenderFieldOnTreeDom,
    Context as ContextForm,
    clone,
    getField 
} from '../utils';

let Form = function (props: Props, ref) {

    const Context = useRef<Create>({
        errorsControl: [],
        components: [],
        onError: () => null,
        ComponentWrap: Grid,
        button: undefined,
        footerProps: {},
        context: {}
    });

    props = { ...Context.current.context, ...props }
    const lastChangedField = useRef([] as ([name: any, value: any] | []))
    const isSubmited = useRef(false)
    const form = useRef<HTMLFormElement>(null);
    const [fieldsFromRender, setFieldsFromRender] = useState<Array<Field>>([]);

    let fields = props.fields?.concat?.(props.staticFields || [])

    const hookValues = useValues({
        fields: (fields || []).concat(fieldsFromRender),
        initialValues: useMemo(() => Object.assign({}, props.initialValues, props.fixedValues), [props.initialValues, props.fixedValues])
    });

    const hookErrors = useErrors({
        fields: (fields || []).concat(fieldsFromRender).filter(e => e.active !== false),
        values: hookValues.valuesChain,
        getErrorsControl: () => Context.current.errorsControl || [],
        yupSchema: props.validationSchema
    });

    const getStates = useData<{
        fieldsFromRender: typeof fieldsFromRender,
        fields: typeof props.fields,
        hookValues: typeof hookValues,
        hookErrors: typeof hookErrors,
        isSubmited: typeof isSubmited,
    }>({
        fieldsFromRender, 
        fields: props.fields, 
        hookValues,
        hookErrors,
        isSubmited
    })
   
    useEffect(() => {
        if (lastChangedField.current[0] && isSubmited.current) {
            hookErrors.verifyAllErrors(lastChangedField.current[0])
        }
    }, [hookValues.values, isSubmited])

    //---------------------------------------------- ações básicas -------------------------------------
    const actions = useMemo(() => ({
        clean() {
            const {hookValues, hookErrors, isSubmited} = getStates()
            
            hookErrors.cleanErrors();
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
            
            const {fieldsFromRender, fields, hookValues} = getStates()
             
            const fd = getField((fields || []).concat(fieldsFromRender), _name, false)

            hookValues.changeValue(_name, _value, function (field, value) {
                lastChangedField.current = [_name, _value]
                props.onChangeField?.(field || fd, value, others)
            });
        }
    }), [])

    //---------------------------------------------- submição de formulário -------------------------------------
    const submit = async (evt) => {
        evt?.preventDefault?.();
        isSubmited.current = true;
        let errors = await hookErrors.verifyAllErrors()
        let valuesCloned = clone(hookValues.values)

        if (fields) {
            let field: Array<Field> = getFlatFields(fields).filter(field => field.active !== false);
            field.filter(e => e.output && e.visible !== false).forEach(e => {
                if (e.name) valuesCloned[e.name] = e.output!(hookValues.values[e.name]);
            });
        }

        props.onBeforeSubmit?.(valuesCloned);
        if (!!Object.keys(errors).length) {
            Context.current.onError?.(errors);
            return false;
        } else {
            
            if (props.formData) valuesCloned = objectToForm(valuesCloned);

            props.onSubmit?.(valuesCloned);
            if (props.clean) actions.clean()

            return true;
        }
    }

    // --------------------------------------- renderização isolada de um determinado componente------------------------------

    function renderField(obj: Field){
        let comp = obj.wrap ? obj.wrap(getFieldComponent(obj)) : getFieldComponent(obj)
        
        comp = {...comp }

        Object.defineProperty(comp, 'constructorObject', {
            enumerable: false,
            configurable: true,
            value: obj
        })
        Object.defineProperty(comp, 'isRenderField', {
            enumerable: false,
            configurable: true,
            value: true
        })
        
        return comp
    }

    const setFieldsFromRenderDebounce = useMemo(() => debounce(function(fields, fieldsFromRender){
        const filter = data => typeof data[1] !== 'function'

        const formatFieldsToCompare = fields => fields.map(field => filterProperty(field || {}, filter))

        if (!dequal(formatFieldsToCompare(fields), formatFieldsToCompare(fieldsFromRender))) {

            setFieldsFromRender([...fields])
        }
    }, 100), [])

    function connectChildren(element){
        setFieldsFromRenderDebounce(findComponentByRenderFieldOnTreeDom(element), fieldsFromRender)  
        return element
    }

    //---------------------------------------------- inicialização ---------------------------------------------
    const argumentsToContexts = {
        props,
        errors: hookErrors.errors,
        values: hookValues.values,
        valuesChain: hookValues.valuesChain,
        verifyAllErrors: hookErrors.verifyAllErrors,
        changeValue: actions.changeValue,
        submit,
        clean: actions.clean,
        allFields: (fields ? getFlatFields(fields) : []).concat(fieldsFromRender),
        renderField
    }

    const localContext: Create = this?.(argumentsToContexts) || {};
    const propsContext: Partial<Create> = props.create?.(argumentsToContexts) || {}

    const getAttr = (attr: string, defaultValue?: any) => propsContext[attr] || localContext[attr] || defaultValue

    Context.current = {
        errorsControl: getAttr('errorsControl', []),
        components: getAttr('components', []),
        onError: getAttr('onError', () => null),
        ComponentWrap: getAttr('ComponentWrap', Grid),
        button: getAttr('button'),
        footerProps: getAttr('footerProps'),
        context: getAttr('context'),
    }
    //---------------------------------------------- controle de referência -------------------------------------

    useImperativeHandle(ref, () => ({ ...argumentsToContexts, form: form.current, setValues: hookValues.setValues }))

    //---------------------------------------------- controle de linhas e colunas -------------------------------------

    const configRow = {
        row: true,
        alignItems: props.alignItems || 'flex-start',
        justify: props.justify,
        align: props.align,
        direction: props.direction,
        spacing: props.spacing || 2,
    }

    const _getComponentBase = (components, field) => getComponentBase(components, field) || getComponentBase(components, field, 'default')

    function getFieldComponent(field: Field) {
        
        if (fields || props.children) {

            if (field.fields) return render(field.fields);
            if (field.type == 'component' && field.content) {
                const comp = field.content({ ...argumentsToContexts, fields: fields || [] });
                setFieldsFromRenderDebounce(findComponentByRenderFieldOnTreeDom(comp), fieldsFromRender)
                return comp
            }

            let _field = filterProperty(field, ['input', 'output'])
            return _getComponentBase(Context.current.components, _field).content?.(_field);
            
        }
    }
    const render = (fields) => {
        return (
            fields.filter(e => e.visible !== false).map((field, index) => {
                let componentBaseField = _getComponentBase(Context.current.components, field);
                let fieldComponent = field.wrap ? field.wrap(getFieldComponent(field)) : getFieldComponent(field)

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
                        key={field.name || field.key || index}
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
                        {fieldComponent}
                        {field.afterContent}
                    </Context.current.ComponentWrap>
                ) : fieldComponent
            })
        )
    }
    
    //---------------------------------------------- COMPONENTE -------------------------------------
    return (
        <ContextForm.Provider value={argumentsToContexts}>
            <form onSubmit={submit} ref={form}>
                {props.children ? connectChildren(props.children(argumentsToContexts)) : (
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
                                style={{ marginTop: 20 }}
                                {...Context.current.footerProps}
                            >
                                {props.beforeButtonElement}
                                {props.onSubmit && Context.current.button}
                                {props.afterButtonElement}
                            </Context.current.ComponentWrap>

                        }
                    </>
                )}
            </form>
        </ContextForm.Provider>
    )
}

export const create = (data: (params: ParamsCreate) => Create) => (forwardRef(Form.bind(data)) as React.ForwardRefExoticComponent<React.PropsWithoutRef<Props> & { [x: string]: any }>);
export default Form;