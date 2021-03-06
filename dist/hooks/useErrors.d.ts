import { Field } from '../types';
import { ReturnUseErrorsFunctionParams, useErrorsFunctionParams } from '../types/hooks';
export default function useErrors({ fields, getErrorsControl, yupSchema, values }: useErrorsFunctionParams<Field>): ReturnUseErrorsFunctionParams;
