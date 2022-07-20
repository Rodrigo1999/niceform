/// <reference types="react" />
import { ReturnUseErrorsFunctionParams, errorsControl } from './hooks';
import type { Breakpoints } from 'dynamic-react-grid';
export { Breakpoints };
export declare type ValueKeys = {
    [key: string]: any;
};
export interface Components {
    /**
     * Defines the field type
     */
    type: string;
    /**
     * Through this property we can pass props in the element that surrounds the field
     */
    contentProps?: Partial<JSX.IntrinsicElements['div']> & Partial<Col> & ValueKeys;
    /**
     * The field itself to be configured
     */
    content: Function;
}
interface ContentParams {
    /**
     * Checks if the form contains any invalid fields, to check a specific field, pass its name as a function parameter.
     */
    verifyAllErrors: ReturnUseErrorsFunctionParams['verifyAllErrors'];
    /**
     * Returns all error postings regarding form fields
     */
    errors: object;
    /**
      * With this function we can change the value of a certain form field
      */
    changeValue: (evt: React.ChangeEvent<HTMLInputElement> | string, value?: any, others?: any) => void;
    /**
      * When calling this function the form will be reset
      */
    clean: Function;
    /**
      * Returns form values
      */
    values: Object;
    /**
     * Returns form values range of an array or object
    */
    valuesChain: Object;
    /**
     * Returns form values
     */
    fields: Array<Field>;
    /**
      * Returns all form fields and their metadata
      */
    allFields: Array<Field>;
    /**
     * Returns all the props of the <Form> component
     */
    props: Props;
    /**
     * Returns all the props of the <Form> component
     */
    submit: (evt?: EventTarget) => void;
    /**
     * Renders a field based on the passed json object
     */
    renderField: (obj: Field) => any;
}
export interface FieldLite extends Breakpoints {
    /**
     * Defines the field type.
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text', // <-
                    name: 'name',
                    label: 'Name'
                }
            ]}
        />
     */
    type?: 'element' | string;
    /**
     * Defines the field label.
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Name' // <-
                }
            ]}
        />
     */
    label?: any;
    /**
     * Defines whether the field will be visible on the screen or not, however it is still active on the form, that is, it is treated as another field, it is just not displayed on the screen.
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Name',
                    visible: true // <-
                }
            ]}
        />
     */
    visible?: boolean;
    /**
     * Unlike visible, this attribute defines whether the field will be active or not in the form, if `false`, the field will not exist in the form's business rule.
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Name',
                    active: true // <-
                }
            ]}
        />
     */
    active?: boolean;
    /**
     * Field name
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name', // <-
                    label: 'Name'
                }
            ]}
        />
     */
    name?: string;
    /**
     * Dependency hierarchy between fields, useful for example when we are working with address, where the `State` field depends on the `Country` field,
     * depending on the `dependence` that we put, if we select a country, the state field will be reset
     * @example
     * <Form
            fields={[
                {
                    xs:4,
                    type:'text',
                    name: 'country',
                    label: 'Country',
                    dependence: 'stick-1'
                },
                {
                    xs:4,
                    type:'text',
                    name: 'state',
                    label: 'State',
                    dependence: 'stick-2' // This field depends on the country field
                },
                {
                    xs:4,
                    type:'text',
                    name: 'city',
                    label: 'City',
                    dependence: 'stick-3' // This field depends on the state field
                },
                {
                    xs:4,
                    type:'text',
                    name: 'district',
                    label: 'District',
                    dependence: 'point-1'
                },
                {
                    xs:4,
                    type:'text',
                    name: 'street',
                    label: 'Street',
                    dependence: 'point-2' // This field depends on the district field
                },
                {
                    xs:4,
                    type:'text',
                    name: 'number',
                    label: 'Number',
                    dependence: 'point-3' // This field depends on the street field
                }
            ]}
        />
     */
    dependence?: string;
    /**
     * Sets the field ordering
     * @example
     * //in the example below the fields will be in reverse order
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Name',
                    order: 2 // <-
                },
                {
                    xs:6,
                    type:'text',
                    name: 'lastname',
                    label: 'Lastname',
                    order: 1 // <-
                }
            ]}
        />
     */
    order?: number;
    /**
     * Defines if this json will contain a list of fields
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    fields: [
                        {
                            xs:6,
                            type:'text',
                            name: 'name',
                            label: 'Name'
                        }
                    ]
                }
            ]}
        />
     */
    fields?: Array<Field>;
    /**
     * I define props that will be inserted in the tag that surrounds the field
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Name',
                    contentProps: { // <-
                        style: {
                            backgroundColor: 'red'
                        }
                    }
                }
            ]}
        />
     */
    contentProps?: Partial<JSX.IntrinsicElements['div']> & Partial<Col> & ValueKeys;
    /**
     * Defines if the field is mandatory
     */
    required?: boolean;
    /**
     * A function that instantiates content to enclose the field
     * @example
     * <Form
            fields={[
                {
                    wrap: (children) => (
                        <div style={{padding: 20, backgroundColor: 'blue'}}>
                            {children}
                        </div>
                    ),
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Name'
                }
            ]}
        />
     */
    wrap?: (children: HTMLElement | JSX.Element) => HTMLElement | JSX.Element;
    /**
     * I insert any content to be rendered inside the form if the value of the `type` attribute mentioned here is equal to `element`
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type: 'element',
                    content: ({changeValue, submit}) => (
                        <div style={{padding: 10, backgroundColor: 'red'}} onClick={() => changeValue('name', 'any value')}>
                            Hello World
                        </div>
                    )
                }
            ]}
        />
     */
    content?: (Object: ContentParams) => any;
    /**
     * With this callback we can change the form input data
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Name',
                    input: value => "prefix-"+value
                }
            ]}
        />
     */
    input?: (value: any) => any;
    /**
     * With this callback we can change the form output data
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Name',
                    output: value => parseInt(value)
                }
            ]}
        />
     */
    output?: (value: any) => any;
    /**
     * I enter unique error handlers for this field
     * @example
     *  <Form
            fields={[
                {
                    label: 'Name',
                    error({value}){
                        if((value || '').length < 5) return 'Invalid number of characters'
                    },
                    
                },
                {
                    //..
                    label: 'Lastname',
                    error({validateSchema}){
                        return validateSchema(Yup.string()
                            .min(5, 'Is less than 5')
                            .max(50, 'Is greater than 50')
                        )
                    }
                },
            ]}
        />
     */
    error?: ({ fields, field, values, value, validateSchema }: {
        fields: Array<Field>;
        field: Field;
        values: Object;
        value: any;
        validateSchema: (shcema: any) => Promise<any>;
    }) => string | undefined | void | Promise<string | undefined | void>;
    /**
     * Specifies whether debounce in this field will be active. Note: (you must use the 'useDebounce' hook together)
     * @example
     * <Form
     *      enableDebounce={false}
     *  />
     */
    enableDebounce?: boolean;
    /**
     * Specifies the debounce delay time for this field. Note: (you must use the 'useDebounce' hook together)
     * @example
     * <Form
     *      timeDebounce={200}
     *  />
     */
    timeDebounce?: number;
}
export declare type Field = FieldLite & Breakpoints & ValueKeys;
export interface Create {
    /**
     * Error handling of form fields
     * @example
     * import { create } from 'dynamic-react-form';
     * export default function create(data => ({
     *      errorsControl: [
                data => {
                    if(data?.field?.required && !data?.value) return 'Required field'
                },
                data => {
                    if(data?.field?.leng >= 5 && (data?.value || '').length < 5) return 'Requires at least 5 characters'
                }
            ],
     * }))
     */
    errorsControl?: errorsControl<Field>;
    /**
     * Here I define the components that must be used in the form
     * @example
     * import { create } from 'dynamic-react-form';
     * export default function create(data => ({
     *      components: [
                {
                    type: 'text',
                    contentProps: {},
                    content: f => (
                        <MyTextField
                            {...f}
                            label={f.label}
                            value={data.values[f.name]}
                            variant={f.variant}
                            size={f.size}
                            fullWidth
                            changeValue={data.changeValue}
                            error={!!data.errors[f.name]}
                            helperText={data.errors[f.name] || f.help}
                        />
                    )
                }
            ]
     * }))
     */
    components: Array<Components>;
    /**
     * Error listener, triggered every time a field is configured as invalid for submission
     * @example
     * import { create } from 'dynamic-react-form';
     * export default function create(data => ({
     *      onError(errors){
     *          alert('Review the fields')
     *      },
     * }))
     */
    onError?: Function;
    /**
     * Component wrap, by default the Grid tag from dynamic-react-grid is used
     */
    ComponentWrap?: any;
    /**
     * Here I define a form submission button
     * @example
     * import { create } from 'dynamic-react-form';
     * export default function create(data => ({
     *      button: (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={data.submit}
                >
                    {data.props?.button?.label || "Save"}
                </Button>
            )
     * }))
     */
    button?: HTMLElement | JSX.Element;
    /**
     * Step anything, it will be inserted in the tag considered as footer of the form
     */
    footerProps?: Object;
    context?: Omit<Props, 'fields' | 'staticFields' | 'onSubmit' | 'initialValues' | 'onChangeField' | 'onBeforeSubmit' | 'validationSchema' | 'create' | 'children'>;
}
export interface ParamsCreate {
    /**
     * Checks if the form contains any invalid fields, to check a specific field, pass its name as a function parameter.
     */
    verifyAllErrors: ReturnUseErrorsFunctionParams['verifyAllErrors'];
    /**
     * All <Form> component props
     */
    props: Props;
    /**
     * Returns all error postings regarding form fields
     */
    errors: Object;
    /**
     * Returns form values
     */
    values: Object;
    /**
     * Returns form values range of an array or object
    */
    valuesChain: Object;
    /**
     * With this function we can change the value of a certain form field
     */
    changeValue: (evt: React.ChangeEvent<HTMLInputElement> | string, value?: any, others?: any) => void;
    /**
     * When calling this function the form will be submitted
     */
    submit: (evt?: React.FormEvent) => Promise<boolean>;
    /**
     * When calling this function the form will be reset
     */
    clean: (evt?: React.FormEvent) => void;
    /**
     * Returns all form fields and their metadata
     */
    allFields: Array<Field>;
    /**
     * Renders a field based on the passed json object
     */
    renderField: (obj: Field) => any;
}
interface Row {
    /**
     * flex-wrap values
     * @example
     * <Form
     *      wrap='nowrap'
        />
     */
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | 'inherit' | 'initial' | 'unset';
    /**
    * flex-direction values
    * @example
    * <Form
    *      direction='column'
       />
    */
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'inherit' | 'initial' | 'unset';
    /**
    * justify-content values
    * @example
    * <Form
    *      justify='flex-start'
       />
    */
    justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'inherit' | 'initial' | 'unset';
    /**
    * align-content values
    * @example
    * <Form
    *      align='space-between'
       />
    */
    align?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'stretch' | 'inherit' | 'initial' | 'unset';
    /**
     * align-items values
     * @example
     * <Form
     *      alignItems='stretch'
        />
     */
    alignItems?: 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'self-start' | 'self-end' | 'baseline' | 'first baseline' | 'last baseline' | 'safe center' | 'unsafe center' | 'inherit' | 'initial' | 'unset';
    /**
     * Defined in Grid tag with row props. Indicates column spacing, ranging from 0 to infinity. Default 0.
     * (0...infinity)
     * @example
     * <Form
     *      spacing={2}
        />
        or
        <Form
     *      spacing={{
                xs: 2,
                sm: 4,
                md: 5,
            }}
        />
     */
    spacing?: number | Breakpoints;
}
interface Col extends Breakpoints {
    /**
     * Align-self values. Default `wrap`
     */
    self: 'auto' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch' | 'inherit' | 'initial' | 'unset';
    /**
     * Order values (0...infinity)
     */
    order: number;
}
export interface Props extends Row {
    /**
     * Defines the fields the form must have
     * @example
     * <Form
            fields={[
                {
                    xs:6,
                    type:'text',
                    name: 'name',
                    label: 'Full Name',
                    required: true
                }
            ]}
        />
     */
    fields?: Array<Field>;
    /**
     * Similar to initialValues ​​but useful when I want to concatenate to initialValues ​​other values ​​to be sent in the form
     * @example
     * <Form
     *      fixedValues={{
     *          name: 'Rodrigo'
     *      }}
     *      fields={[
     *          {
     *              type: 'text'
     *              name: 'lastname',
     *              label: 'Lastname'
     *          }
     *      ]}
     *      onSubmit={values => console.log(values)} // {name: 'Rodrigo', lastname: '....'}
     *   />
     */
    fixedValues?: Object;
    /**
     * Static fields, they don't appear on the form, but dynamic-react-form considers it as any field
     * @example
     * <Form
            staticFields={[
                {
                    type:'text',
                    name: 'name'
                },
                {
                    type:'text',
                    name: 'lastname'
                },
                {
                    type:'text',
                    name: 'detail.gender'
                }
            ]}
        />
     */
    staticFields?: Array<Field>;
    /**
     * Static fields, they don't appear on the form, but dynamic-react-form considers it as any field
     * @example
     * <Form
     *      beforeButtonElement={(
     *          <div>
     *              any other element
     *          </div>
     *      )}
     *   />
     */
    beforeButtonElement?: JSX.Element;
    /**
     * With this property we can define any element to appear after the submit button
     * <Form
     *      afterButtonElement={(
     *          <div>
     *              any other element
     *          </div>
     *      )}
     *   />
     */
    afterButtonElement?: JSX.Element;
    /**
     * It is called every time the form is submitted
     * @example
     * <Form
     *      onSubmit={values => console.log(values)}
     *  />
     */
    onSubmit?: (values: Object) => void;
    /**
     * Hide the form footer
     * @example
     * <Form
     *      hiddenFooter
     * />
     */
    hiddenFooter?: boolean;
    /**
     * Sets initial values ​​for the form
     * @example
     * <Form
     *      initialValues={{
     *          name: 'Foo',
     *          lastname: 'Bar'
     *      }}
     * />
     */
    initialValues?: Object;
    /**
     * Called every time the value of a given field changes
     * @example
     * <Form
     *      onChangeField={(field, value, any) => console.log(field, value, any)}
     * />
     */
    onChangeField?: (field: Object, value: any, other: any) => void;
    /**
     * Called every time I try to submit the form, it is called even if a field is invalid
     * @example
     * <Form
     *      onBeforeSubmit={values => console.log(values)}
     *  />
     */
    onBeforeSubmit?: (values: Object) => void;
    /**
     * If true, form values ​​will be converted to `formData` object
     * @example
     * <Form
     *      formData
     *  />
     */
    formData?: boolean;
    /**
     * If true, form fields will be cleared every time a successful submission occurs.
     * @example
     * <Form
     *      clean
     *  />
     */
    clean?: boolean;
    /**
     * Where we pass the reference
     * @example
     * const ref = useRef(null)
     * <Form
     *      ref={ref}
     *  />
     */
    ref?: {
        current: any;
    };
    /**
     * Define settings for grid, `row` and `col`
     * @example
     * <Form
     *      grid={{
     *          row: {
     *              direction: 'row'
     *          },
     *          col: {
     *              self: 'auto'
     *          }
     *      }}
     *  />
     */
    grid?: {
        row: Row;
        col: Col & JSX.IntrinsicElements['div'];
    };
    /**
     * Schema `yup` to be passed for error handling
     * @example
     *  import * as Yup from 'yup'
     *
    *   const SignupSchema = Yup.object().shape({
            name: Yup.string()
            .min(5, 'Too Short!')

            lastname: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
        });
     *  <Form
     *       validationSchema={SignupSchema}
     *  />
     */
    validationSchema?: any;
    /**
     * Equivalent to `create` imported from dynamic-react-form, useful in case I want to configure the form locally
     * @example
     * <Form
     *      create={data => ({
     *          components: [],
     *          button: (
     *              <button>Send</button>
     *          )
     *      })}
     *  />
     */
    create?: (params: ParamsCreate) => Partial<Create>;
    /**
     * In case we want to use the form with children in context instead of fields
     * @example
     * <Form>
     *      {(data) => (
                <>
                    <input type='text' name='name' placeholder='Name' onChange={data.changeValue}/>
                    <input type='text' name='lastname' placeholder='Lastname' onChange={evt => data.changeValue('lastname', evt.target.value)}/>
                    <button type='submit'>
                        submit
                    </button>
                </>
          )}
        </Form>
     */
    children?: (params: ParamsCreate) => any;
    /**
     * Specifies whether debounce on fields will be actives. Note: (you must use the 'useDebounce' hook together)
     * @example
     * <Form
     *      enableDebounce={false}
     *  />
     */
    enableDebounce?: boolean;
    /**
     * Specifies the debounce delay time. Note: (you must use the 'useDebounce' hook together)
     * @example
     * <Form
     *      timeDebounce={200}
     *  />
     */
    timeDebounce?: number;
}
